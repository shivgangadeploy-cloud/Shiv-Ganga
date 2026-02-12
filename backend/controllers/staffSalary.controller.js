import StaffSalary from "../models/staffSalary.model.js";
import Receptionist from "../models/Receptionist.model.js";
import StaffTransaction from "../models/staffTransaction.model.js";
import razorpay from "../configs/razorpay.js";

export const payStaffSalary = async (req, res, next) => {
  let payoutTxn;

  try {
    const { salaryId } = req.body;

    const salary = await StaffSalary.findById(salaryId)
      .populate("receptionist");

    if (!salary) {
      return res.status(404).json({
        success: false,
        message: "Salary record not found"
      });
    }

    if (salary.status === "PAID") {
      return res.status(400).json({
        success: false,
        message: "Salary already paid"
      });
    }

    const receptionist = salary.receptionist;

    if (
      salary.paymentMethod !== "CASH" &&
      !receptionist.razorpayFundAccountId
    ) {
      return res.status(400).json({
        success: false,
        message: "Staff fund account not configured"
      });
    }

    payoutTxn = await StaffTransaction.create({
      receptionist: receptionist._id,
      salary: salary._id,
      amount: salary.totalPayable,
      method: salary.paymentMethod,
      paymentGateway:
        salary.paymentMethod === "CASH" ? "MANUAL" : "RAZORPAY",
      status: "PENDING"
    });

    let razorpayPayout = null;

    if (salary.paymentMethod === "CASH") {
      razorpayPayout = {
        id: "manual_" + Date.now(),
        status: "processed"
      };
    } else {
      razorpayPayout = await razorpay.payouts.create({
        account_number: process.env.RAZORPAY_ACCOUNT_NUMBER,
        fund_account_id: receptionist.razorpayFundAccountId,
        amount: salary.totalPayable * 100,
        currency: "INR",
        mode: salary.paymentMethod === "UPI" ? "UPI" : "IMPS",
        purpose: "salary",
        queue_if_low_balance: true,
        reference_id: salary._id.toString(),
        narration: `Salary ${salary.month}-${salary.year}`
      });
    }

    payoutTxn.status =
      razorpayPayout.status === "processed" ||
      razorpayPayout.status === "queued"
        ? "SUCCESS"
        : "FAILED";

    payoutTxn.razorpayPayoutId = razorpayPayout.id;
    payoutTxn.razorpayResponse = razorpayPayout;
    await payoutTxn.save();

    salary.status = "PAID";
    salary.paidAt = new Date();
    await salary.save();

    res.status(200).json({
      success: true,
      message: "Salary payout initiated successfully",
      payout: payoutTxn
    });

  } catch (error) {
    if (payoutTxn) {
      payoutTxn.status = "FAILED";
      payoutTxn.failureReason = error.message;
      await payoutTxn.save();
    }
    next(error);
  }
};


export const processStaffSalary = async (req, res, next) => {
  try {
    const {
      receptionistId,
      month,
      year,
      basicSalary,
      allowances = 0,
      deductions = 0,
      paymentMethod
    } = req.body;

    
    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: "Month and year are required"
      });
    }

    const receptionist = await Receptionist.findById(receptionistId);
    if (!receptionist) {
      return res.status(404).json({
        success: false,
        message: "Receptionist not found"
      });
    }

    const finalBasicSalary =
  basicSalary !== undefined
    ? Number(basicSalary)
    : receptionist.basicSalary;

 const totalPayable =
  finalBasicSalary + Number(allowances) - Number(deductions);

const salary = await StaffSalary.create({
  receptionist: receptionistId,
  month,
  year,
  basicSalary: finalBasicSalary,
  allowances,
  deductions,
  totalPayable,
  paymentMethod,
  status: "PENDING"
});


    res.status(201).json({
      success: true,
      message: "Salary processed successfully",
      data: salary
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Salary already exists for this month and year"
      });
    }
    next(error);
  }
};



/* ================= STAFF PAYMENT LIST ================= */
export const getStaffPayments = async (req, res) => {
  const payments = await StaffSalary.find()
    .populate("receptionist", "firstName lastName employeeId email")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: payments
  });
};

/* ================= DASHBOARD STATS ================= */
export const getStaffPaymentStats = async (req, res) => {
  const totalStaff = await Receptionist.countDocuments();

  const paid = await StaffSalary.aggregate([
    { $match: { status: "PAID" } },
    { $group: { _id: null, total: { $sum: "$totalPayable" } } }
  ]);

  const pending = await StaffSalary.aggregate([
    { $match: { status: { $ne: "PAID" } } },
    { $group: { _id: null, total: { $sum: "$totalPayable" } } }
  ]);

  res.json({
    success: true,
    totalStaff,
    totalPaidThisMonth: paid[0]?.total || 0,
    outstanding: pending[0]?.total || 0
  });
};



export const getAllStaffWithSalaryStatus = async (req, res, next) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: "Month and year are required"
      });
    }

    // 1️⃣ all staff
    const staffList = await Receptionist.find({ isActive: true })
      .select("firstName lastName employeeId role email phoneNumber basicSalary");

    // 2️⃣ salaries for given month
    const salaries = await StaffSalary.find({
      month,
      year
    });

    // 3️⃣ map salary by receptionistId
    const salaryMap = {};
    salaries.forEach((sal) => {
      salaryMap[sal.receptionist.toString()] = sal;
    });

    // 4️⃣ merge staff + salary
const result = staffList.map((staff) => {
  const salary = salaryMap[staff._id.toString()];

  return {
    _id: staff._id,
    name: `${staff.firstName} ${staff.lastName}`,
    employeeId: staff.employeeId,
    role: staff.role,
    email: staff.email,
    phoneNumber: staff.phoneNumber,

    salaryStatus: salary ? salary.status : "PENDING",

    basicSalary: salary?.basicSalary ?? staff.basicSalary,
    allowances: salary?.allowances || 0,
    deductions: salary?.deductions || 0,
    totalPayable: salary?.totalPayable || staff.basicSalary || 0,

    salaryId: salary?._id || null
  };
});

    res.status(200).json({
      success: true,
      count: result.length,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

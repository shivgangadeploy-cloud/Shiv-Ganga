import StaffSalary from "../models/staffSalary.model.js";
import StaffTransaction from "../models/staffTransaction.model.js";
import mongoose from "mongoose";

export const getSalaryReportList = async (req, res, next) => {
  try {
    const {
      status,
      month,
      year
    } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (month) filter.month = month;
    if (year) filter.year = Number(year);

    const salaries = await StaffSalary.find(filter)
      .populate("receptionist", "firstName lastName employeeId")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: salaries
    });
  } catch (error) {
    next(error);
  }
};

export const getPayrollStats = async (req, res, next) => {
  try {
    const totalExpense = await StaffSalary.aggregate([
      { $match: { status: "PAID" } },
      { $group: { _id: null, total: { $sum: "$totalPayable" } } }
    ]);

    const avgSalary = await StaffSalary.aggregate([
      { $match: { status: "PAID" } },
      { $group: { _id: null, avg: { $avg: "$totalPayable" } } }
    ]);

    const breakdown = await StaffSalary.aggregate([
      { $match: { status: "PAID" } },
      {
        $group: {
          _id: null,
          basic: { $sum: "$basicSalary" },
          allowances: { $sum: "$allowances" },
          deductions: { $sum: "$deductions" }
        }
      }
    ]);

    res.json({
      success: true,
      totalPayrollExpense: totalExpense[0]?.total || 0,
      averageNetSalary: avgSalary[0]?.avg || 0,
      breakdown: breakdown[0] || {
        basic: 0,
        allowances: 0,
        deductions: 0
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getSalaryHistory = async (req, res, next) => {
  try {
    const history = await StaffTransaction.find()
      .populate("receptionist", "firstName lastName employeeId")
      .populate("salary", "month year totalPayable")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    next(error);
  }
};



import TaxesAndBilling from "../models/TaxesAndBilling.model.js";


export const createTaxesAndBillingSettings = async (req, res, next) => {
  try {
    const { gstPercentage, extraBedPricePerNight } = req.body;

   
    const existing = await TaxesAndBilling.findOne({ isActive: true });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Taxes & billing settings already exist. Use update API."
      });
    }

    if (gstPercentage < 0 || gstPercentage > 100) {
      return res.status(400).json({
        success: false,
        message: "GST percentage must be between 0 and 100"
      });
    }

    if (extraBedPricePerNight < 0) {
      return res.status(400).json({
        success: false,
        message: "Extra bed price must be >= 0"
      });
    }

    const settings = await TaxesAndBilling.create({
      gstPercentage,
      extraBedPricePerNight
    });

    res.status(201).json({
      success: true,
      message: "Taxes & billing settings created successfully",
      data: settings
    });
  } catch (error) {
    next(error);
  }
};

export const getTaxesAndBillingSettings = async (req, res, next) => {
  try {
    let settings = await TaxesAndBilling.findOne({ isActive: true });

  
    if (!settings) {
      settings = await TaxesAndBilling.create({
        gstPercentage: 12,
        extraBedPricePerNight: 1200
      });
    }

    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    next(error);
  }
};


export const updateTaxesAndBillingSettings = async (req, res, next) => {
  try {
    const { gstPercentage, extraBedPricePerNight } = req.body;

    if (
      gstPercentage < 0 ||
      gstPercentage > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "GST percentage must be between 0 and 100"
      });
    }

    if (extraBedPricePerNight < 0) {
      return res.status(400).json({
        success: false,
        message: "Extra bed price must be >= 0"
      });
    }

    let settings = await TaxesAndBilling.findOne({ isActive: true });

    if (!settings) {
      settings = await TaxesAndBilling.create({
        gstPercentage,
        extraBedPricePerNight
      });
    } else {
      settings.gstPercentage = gstPercentage;
      settings.extraBedPricePerNight = extraBedPricePerNight;
      await settings.save();
    }

    res.status(200).json({
      success: true,
      message: "Taxes & billing settings updated successfully",
      data: settings
    });
  } catch (error) {
    next(error);
  }
};

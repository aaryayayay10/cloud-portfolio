const { saveInquiry } = require("../services/inquiryService");

const submitInquiry = async (req, res) => {

    try {

        console.log("========== NEW INQUIRY ==========");
        console.log(req.body);

        const saved = await saveInquiry(req.body);

        console.log("Saved:", saved);

        return res.status(201).json({
            success: true,
            message: "Inquiry submitted successfully!"
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

module.exports = {
    submitInquiry
};
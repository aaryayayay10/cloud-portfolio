const supabase = require("../database/supabase");

async function saveInquiry(inquiryData) {

    const dataToSave = {
        ...inquiryData,
        services: Array.isArray(inquiryData.services)
            ? inquiryData.services
            : [inquiryData.services],
        status: "New"
    };

    const { data, error } = await supabase
        .from("leads")
        .insert([dataToSave])
        .select();

    if (error) {
        throw new Error(error.message);
    }

    return data[0];
}

module.exports = {
    saveInquiry
};
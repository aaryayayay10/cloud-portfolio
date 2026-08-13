const supabase = require("../database/supabase");

async function saveInquiry(inquiryData) {

    const {
        name,
        full_name,
        company,
        email,
        phone,
        services,
        message,
        description,
        timeline,
        budget
    } = inquiryData;

    const dataToSave = {
        full_name: full_name || name,
        email,
        description: description || message,
        status: "New"
    };

    if (company) {
        dataToSave.company = company;
    }

    if (phone) {
        dataToSave.phone = phone;
    }

    if (services) {
        dataToSave.services = Array.isArray(services) ? services : [services];
    }

    if (timeline) {
        dataToSave.timeline = timeline;
    }

    if (budget) {
        dataToSave.budget = budget;
    }

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

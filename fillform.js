const express = require('express');
const router = express.Router();

router.post('/saveFormData', (req, res) => {
    console.log('Saving form data:', req.body);
    req.session.formData = req.body;
    res.status(200).json("Form submitted successfully! Get back on to the form to update more details!");

});

router.post('/saveFormData1', (req, res) => {
    console.log('Saving form data 1:', req.body);
    req.session.formData1 = req.body;
    res.status(200).json("Form submitted successfully! Get back on to the form to update more details!");

});

router.post('/saveFormData2', (req, res) => {
    console.log('Saving form data 2:', req.body);
    req.session.formData2 = req.body;
    res.status(200).json("Form submitted successfully! Get back on to the form to update more details!");

});

module.exports = router;

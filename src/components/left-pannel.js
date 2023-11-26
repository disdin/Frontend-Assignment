import React, { useState } from 'react'
import { Stack, TextField, Typography, Button } from '@mui/material'
import * as Yup from 'yup';

const LeftPannel = ({setUiJson}) => {
    const [formValues, setFormValues] = useState('');
    const [errors, setErrors] = useState('');
    const validationSchema = Yup.string().required('Value cannot be empty');

    const handleChange = (event) => {
        const { value } = event.target;
        setFormValues(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await validationSchema.validate(formValues);
            setErrors('');
            const jsonData = JSON.parse(formValues);
            setUiJson(jsonData);
        } catch (error) {
            setErrors(error.message);
        }
    };
    return (
        <Stack alignItems="center" justifyContent="flex-start" sx={{padding: { md: "2rem 1rem", xs: "0.5rem" }, height: "100%", width: { md: "30%", xs: "auto" }, mt:{xs:"2rem",md:0} }}>
            <form style={{ width: "100%" }} onSubmit={handleSubmit}>
                <Stack spacing={5} >
                    <Typography textAlign="center" variant="h5">Enter UI JSON</Typography>
                    <Stack>
                        <TextField
                            className="textField"
                            multiline
                            rows={15}
                            variant="outlined"
                            label="Enter text here..."
                            value={formValues}
                            onChange={handleChange}
                            error={Boolean(errors)}
                            helperText={errors}
                        />
                    </Stack>
                    <Stack alignItems="center">
                        <Button color='primary' type="submit" variant="contained">Submit</Button>
                    </Stack>
                </Stack>
            </form>
        </Stack>
    )
}

export default LeftPannel
import { Stack, TextField, FormLabel, Box, Radio, Backdrop, Fade, Modal, Checkbox, FormControl, Typography, FormControlLabel, FormHelperText, Button, RadioGroup, MenuItem, Select } from '@mui/material'
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react'
import { generateValidationSchema } from './generateValidationSchema';



const RightPannel = ({ uiJson }) => {
    const [formValues, setFormValues] = useState({});
    const [validationSchema, setValidationSchema] = useState(null);
    const [errors, setErrors] = useState('');
    const { enqueueSnackbar } = useSnackbar();
    const [open, setOpen] = useState(false);
    const [modalInput, setModalInput] = useState("");

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        borderRadius:"10px",
        boxShadow: 24,
        p: 4,
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleChange = (event, jsonKey) => {
        const { value } = event.target;
        setFormValues((prevValues) => ({ ...prevValues, [jsonKey]: value }));
    };

    const convertToObject = (obj) => {
        const result = {};
        for (const key in obj) {
          const keys = key.split('.');
          keys.reduce((acc, cur, index) => {
            if (index === keys.length - 1) {
              acc[cur] = obj[key];
            } else {
              acc[cur] = acc[cur] || {};
            }
            return acc[cur];
          }, result);
        }
        return result;
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await validationSchema.validate(formValues, { abortEarly: false });
            setErrors('');
            const dum = convertToObject(formValues)
            setModalInput(JSON.stringify(dum,null, 2));
            handleOpen();

        } catch (validationErrors) {
            const errorObj = {};
            validationErrors.inner.forEach((error) => {
                errorObj[error.path] = error.message;
            });
            setErrors(errorObj);
            enqueueSnackbar({ message: "Please enter valid values to submit the form", variant: "error" });

        }
    };
    console.log(errors);

    const renderForm = (jsonData, parent) => {
        const formData = jsonData.sort((a, b) => a.sort - b.sort);
        return (
            <Stack spacing={2}>
                {formData?.map((param) => {
                    switch (param.uiType) {
                        case 'Input':
                            return (
                                <Stack direction="row" alignItems="space-between" key={param.jsonKey}>
                                    <Stack justifyContent="center" sx={{ width: "40%" }}>
                                        <FormLabel>
                                            {param.label}
                                            {param.validate && param.validate.required && <span style={{ color: 'red', margin: "0px 4px" }}>*</span>}
                                        </FormLabel>
                                    </Stack>
                                    <Stack justifyContent="center" sx={{ width: "60%" }}>
                                        <TextField
                                            id={param.jsonKey}
                                            name={`${parent}${param.jsonKey}`}
                                            type="text"
                                            value={formValues[parent + param.jsonKey] || ''}
                                            onChange={(event) => { handleChange(event, parent + param.jsonKey) }}
                                            variant="outlined"
                                            fullWidth
                                            disabled={param.validate.immutable}
                                            placeholder={param.placeholder}
                                            error={(!formValues.hasOwnProperty(`${parent + param.jsonKey}`) || formValues[parent + param.jsonKey] === '')}
                                            helperText={(!formValues.hasOwnProperty(`${parent + param.jsonKey}`) || formValues[parent + param.jsonKey] === '') ? "Value is required" : null}
                                        />
                                    </Stack>
                                </Stack>
                            );
                        case 'Select':
                            return (
                                <FormControl key={param.jsonKey} fullWidth>
                                    <Stack direction="row" alignItems="space-between" >
                                        <Stack justifyContent="center" sx={{ width: "40%" }}>
                                            <FormLabel>
                                                {param.label}
                                                {param.validate && param.validate.required && <span style={{ color: 'red', margin: "0px 4px" }}>*</span>}
                                            </FormLabel>
                                        </Stack>
                                        <Stack justifyContent="center" sx={{ width: "60%" }}>
                                            <Select
                                                name={`${parent}${param.jsonKey}`}
                                                id={param.jsonKey}
                                                value={formValues[parent + param.jsonKey] || param.validate.defaultValue}
                                                onChange={(event) => handleChange(event, parent + param.jsonKey)}
                                                defaultValue={() => {
                                                    setFormValues(prev => ({ ...prev, [parent + param.jsonKey]: param.validate.defaultValue }))
                                                    return param.validate.defaultValue;
                                                }}
                                                variant="outlined"
                                                fullWidth
                                                disabled={param.validate.immutable}
                                            >
                                                {param.validate.options.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {errors[parent + param.jsonKey] ? (
                                                <FormHelperText style={{ color: "#ff7150" }}>
                                                    {errors[parent + param.jsonKey]}
                                                </FormHelperText>
                                            ) : null}
                                        </Stack>
                                    </Stack>
                                </FormControl>
                            );
                        case 'Radio':
                            return (
                                <Stack direction="row" alignItems="space-between" key={param.jsonKey}>
                                    <Stack justifyContent="center" sx={{ width: "40%" }}>
                                        <FormLabel>
                                            {param.label}
                                            {param.validate && param.validate.required && <span style={{ color: 'red', margin: "0px 4px" }}>*</span>}
                                        </FormLabel>
                                    </Stack>
                                    <Stack justifyContent="center" sx={{ width: "60%" }}>
                                        <RadioGroup
                                            aria-label={param.label}
                                            name={`${parent}${param.jsonKey}`}
                                            value={formValues[parent + param.jsonKey] || param.validate.defaultValue}
                                            onChange={(event) => handleChange(event, parent + param.jsonKey)}
                                            disabled={param.validate.immutable}
                                            defaultValue={() => {
                                                setFormValues(prev => ({ ...prev, [parent + param.jsonKey]: param.validate.defaultValue }))
                                                return param.validate.defaultValue;
                                            }}
                                            sx={{ flexDirection: 'row' }}
                                        >
                                            {param.validate.options.map((option) => (
                                                <FormControlLabel key={option.value} value={option.value} control={<Radio />} label={option.label} />
                                            ))}
                                        </RadioGroup>
                                    </Stack>
                                </Stack>
                            );
                        case 'Switch':
                            return (
                                <Stack key={param.jsonKey}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                id={param.jsonKey}
                                                checked={!!formValues[parent + param.jsonKey]}
                                                onChange={(event) => setFormValues((prevValues) => ({ ...prevValues, [parent + param.jsonKey]: event.target.checked }))}
                                                color="primary"
                                                disabled={param.validate.immutable}
                                            />
                                        }
                                        label={param.label}
                                    />
                                </Stack>
                            );
                        case 'Ignore':
                            return formValues[param.conditions[0].jsonKey] === param.conditions[0].value ? (
                                <div key={param.jsonKey}>
                                    <FormLabel sx={{ fontWeight: "600" }}>
                                        {param.label}
                                        {param.validate && param.validate.required && <span style={{ color: 'red', margin: "0px 4px" }}>*</span>}
                                    </FormLabel>
                                    {param.subParameters && renderForm(param.subParameters, parent + param.jsonKey + '.')}
                                </div>
                            ) : null;
                        case 'Group':
                            return (
                                <div key={param.jsonKey}>
                                    <FormLabel sx={{ fontWeight: "600", fontSize: "1.1rem" }}>
                                        {param.label}
                                        {param.validate && param.validate.required && <span style={{ color: 'red', margin: "0px 4px" }}>*</span>}
                                    </FormLabel>
                                    {param.subParameters && renderForm(param.subParameters, parent + param.jsonKey + '.')}
                                </div>
                            );
                        default:
                            return null;
                    }
                })}
            </Stack>
        )

    };

    useEffect(() => {
        if (uiJson) {
            const Schema = generateValidationSchema(uiJson);
            setValidationSchema(Schema);
            // setFormValues({})
        }
    }, [uiJson])


    return (
        <Stack alignItems="center" justifyContent="center" sx={{ padding: { md: "2rem 6rem", xs: "2rem" }, width: { md: "70%", xs: "auto" }, border: { xs: "1px solid grey", md: "none" }, mt: { xs: "5rem", md: 0 } }}>
            <form style={{ overflow: "auto", width: "100%" }} onSubmit={handleSubmit}>
                <Stack sx={{}} spacing={3}>
                    {uiJson && (
                        <Stack textAlign="center">
                            <Typography variant="h5">Form</Typography>
                        </Stack>
                    )}
                    <Stack sx={{ marginTop: "10px" }}>
                        {uiJson && renderForm(uiJson, "")}
                    </Stack>
                    {uiJson && (
                        <Stack alignItems="center" >
                            <Button color='primary' type="submit" variant="contained" sx={{ marginTop: "3rem" }}>Submit</Button>
                        </Stack>
                    )}
                </Stack>
            </form>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={open}>
                    <Box sx={style}>
                        <Stack>
                            <TextField
                                className="textField"
                                multiline
                                rows={12}
                                variant="outlined"
                                label="Schema"
                                value={modalInput}
                            />
                        </Stack>
                    </Box>
                </Fade>
            </Modal>
        </Stack>
    )
}

export default RightPannel
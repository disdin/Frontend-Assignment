import * as yup from 'yup';

export const generateValidationSchema = (formData) => {
    const schema = {};

    formData.forEach((param) => {
        switch (param.uiType) {
            case 'Input':
                schema[param.jsonKey] = yup.string();
                if (param.validate.required) {
                    schema[param.jsonKey] = schema[param.jsonKey].required(`${param.label} is required`);
                }
                break;
            case 'Radio':
                schema[param.jsonKey] = yup.string().oneOf(
                    param.validate.options.map((option) => option.value),
                    `${param.label} is required`
                );
                break;
            case 'Switch':
                schema[param.jsonKey] = yup.boolean();
                break;
            case 'Select':
                schema[param.jsonKey] = yup.string().oneOf(
                    param.validate.options.map((option) => option.value),
                    `${param.label} is required`
                );
                break;
            case 'Group':
                const groupSchema = {};
                if (param.subParameters)
                    param.subParameters.forEach((subParam) => {
                        switch (subParam.uiType) {
                            case 'Input':
                                groupSchema[subParam.jsonKey] = yup.string();
                                if (subParam.validate.required) {
                                    groupSchema[subParam.jsonKey] = groupSchema[subParam.jsonKey].required(
                                        `${subParam.label} is required`
                                    );
                                }
                                break;
                            case 'Select':
                                groupSchema[subParam.jsonKey] = yup.string().oneOf(
                                    subParam.validate.options.map((option) => option.value),
                                    `${subParam.label} is required`
                                );
                                break;
                            case 'Switch':
                                groupSchema[subParam.jsonKey] = yup.boolean();
                                break;
                            default:
                                break;
                        }
                    });
                schema[param.jsonKey] = yup.object().shape(groupSchema);
            // Add other cases as needed
            default:
                break;
        }
    });
    return yup.object().shape(schema);
};
export const successResponse = (
    data: unknown,
    message = "Success"
) => {

    return {

        success: true,

        message,

        data

    };

};
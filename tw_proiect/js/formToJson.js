async function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;

    const url = form.action;

    const method = form.method;

    try {
        const formData = new FormData(form);

        const responseData = await postFormDataAsJSON({url, formData, method});

        console.log(responseData);
    } catch (error) {
        console.error(error);
    }
}

async function postFormDataAsJSON({ url, formData, method }) {
    const plainFormData = Object.fromEntries(formData.entries());

    const formDataJsonString = JSON.stringify(plainFormData);

    const fetchOptions = {
        method: method,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: formDataJsonString,
    };

    const response = await fetch(url, fetchOptions);

    if (!response.ok){
        const errorMessage = await response.text();
        throw new Error(errorMessage);
    }

    return response.json();
}

module.exports={handleFormSubmit}
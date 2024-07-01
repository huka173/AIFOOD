const form = document.querySelector('.main-form');
const uploadedImage = document.getElementById('uploaded-image');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        if(response.ok) {
            const data = await response.json();
            const filename = data.message; 

            const img = document.createElement('img');
            const plus = document.getElementById('img-plus');
            plus.style.display = 'none';

            img.src = `/uploads/${filename}`; 
            img.alt = 'upload photo';
            img.style.maxWidth = '100px'; 
            img.style.maxHeight = '100px';

            uploadedImage.innerHTML = ''; 
            uploadedImage.appendChild(img);
        } 
        else {
            console.error('Error', response.status);
        }
    } 
    catch (error) {
        console.error('Error forms', error);
    }
});
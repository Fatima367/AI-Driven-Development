document.addEventListener('DOMContentLoaded', () => {
    const pdfUpload = document.getElementById('pdfUpload');
    const uploadButton = document.getElementById('uploadButton');
    const uploadStatus = document.getElementById('uploadStatus');
    const summarySection = document.getElementById('summary-section');
    const summaryOutput = document.getElementById('summaryOutput');
    const generateQuizButton = document.getElementById('generateQuizButton');
    const quizSection = document.getElementById('quiz-section');
    const quizOutput = document.getElementById('quizOutput');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const loadingMessage = document.getElementById('loadingMessage');

    let uploadedPdfText = ''; // To store the extracted text from PDF

    // Helper functions for UI state
    const showLoading = (message) => {
        loadingMessage.textContent = message;
        loadingOverlay.classList.remove('hidden');
    };

    const hideLoading = () => {
        loadingOverlay.classList.add('hidden');
    };

    const showElement = (element) => {
        element.classList.remove('hidden');
    };

    const hideElement = (element) => {
        element.classList.add('hidden');
    };

    // Initial state
    hideElement(summarySection);
    hideElement(quizSection);
    hideElement(generateQuizButton);

    uploadButton.addEventListener('click', async () => {
        const file = pdfUpload.files[0];
        if (!file) {
            uploadStatus.textContent = 'Please select a PDF file first.';
            return;
        }

        const formData = new FormData();
        formData.append('pdf_file', file);

        uploadStatus.textContent = '';
        hideElement(summarySection);
        hideElement(quizSection);
        hideElement(generateQuizButton);
        showLoading('Uploading and summarizing your PDF...');

        try {
            const response = await fetch('/upload_pdf', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            uploadedPdfText = data.full_text; // Assuming backend returns full text and summary
            summaryOutput.textContent = data.summary;
            
            showElement(summarySection);
            showElement(generateQuizButton);
            uploadStatus.textContent = 'PDF processed and summarized!';

        } catch (error) {
            console.error('Error uploading PDF:', error);
            uploadStatus.textContent = `Error processing PDF: ${error.message}. Please try again.`;
            hideElement(summarySection);
            hideElement(generateQuizButton);
        } finally {
            hideLoading();
        }
    });

    generateQuizButton.addEventListener('click', async () => {
        if (!uploadedPdfText) {
            alert('Please upload a PDF and generate a summary first.'); // Should not happen with button disabled logic
            return;
        }

        hideElement(quizSection);
        showLoading('Generating quiz questions...');

        try {
            const response = await fetch('/generate_quiz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: uploadedPdfText }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            // Format quiz JSON for better readability
            quizOutput.textContent = JSON.stringify(data.quiz, null, 2); 
            showElement(quizSection);

        } catch (error) {
            console.error('Error generating quiz:', error);
            quizOutput.textContent = `Error generating quiz: ${error.message}. Please try again.`;
            hideElement(quizSection); // Hide quiz section on error
        } finally {
            hideLoading();
        }
    });
});

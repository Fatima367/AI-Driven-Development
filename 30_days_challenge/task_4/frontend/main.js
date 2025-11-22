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

    // Function to render the quiz dynamically
    const renderQuiz = (quizData) => {
        quizOutput.innerHTML = ''; // Clear previous quiz content

        if (!quizData || !quizData.questions || quizData.questions.length === 0) {
            quizOutput.innerHTML = '<p>No quiz questions generated.</p>';
            return;
        }

        // const quizTitle = document.createElement('h3');
        // quizTitle.textContent = quizData.title;
        // quizOutput.appendChild(quizTitle);

        quizData.questions.forEach((q, index) => {
            const questionElement = document.createElement('div');
            questionElement.classList.add('quiz-question');
            questionElement.innerHTML = `<p><strong>${index + 1}. ${q.question || q.question_with_blank}</strong></p>`;

            if (q.type === 'mcq' && q.options) {
                const optionsList = document.createElement('div');
                optionsList.classList.add('mcq-options');
                q.options.forEach(option => {
                    const optionLabel = document.createElement('label');
                    optionLabel.classList.add('quiz-option');
                    optionLabel.innerHTML = `
                        <input type="radio" name="question-${index}" value="${option.id}" disabled>
                        <span>${option.text}</span>
                    `;
                    optionsList.appendChild(optionLabel);
                });
                questionElement.appendChild(optionsList);
            } else if (q.type === 'true_false') {
                const optionsList = document.createElement('div');
                optionsList.classList.add('true-false-options');
                const trueLabel = document.createElement('label');
                trueLabel.classList.add('quiz-option');
                trueLabel.innerHTML = `<input type="radio" name="question-${index}" value="true" disabled> <span>True</span>`;
                optionsList.appendChild(trueLabel);

                const falseLabel = document.createElement('label');
                falseLabel.classList.add('quiz-option');
                falseLabel.innerHTML = `<input type="radio" name="question-${index}" value="false" disabled> <span>False</span>`;
                optionsList.appendChild(falseLabel);
                questionElement.appendChild(optionsList);
            } else if (q.type === 'fill_in_the_blank') {
                const inputField = document.createElement('input');
                inputField.type = 'text';
                inputField.classList.add('fill-in-the-blank-input');
                inputField.placeholder = 'Your answer';
                inputField.disabled = true; // Disable for now, enable for user input later
                questionElement.appendChild(inputField);
            }
            quizOutput.appendChild(questionElement);
        });
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
            renderQuiz(data.quiz); // Render the quiz
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


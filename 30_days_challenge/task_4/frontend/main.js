document.addEventListener('DOMContentLoaded', () => {
    const pdfUpload = document.getElementById('pdfUpload');
    const uploadButton = document.getElementById('uploadButton');
    const uploadStatus = document.getElementById('uploadStatus');
    const summarySection = document.getElementById('summary-section');
    const summaryOutput = document.getElementById('summaryOutput');
    const generateQuizButton = document.getElementById('generateQuizButton');
    const quizSection = document.getElementById('quiz-section');
    const quizOutput = document.getElementById('quizOutput');
    const submitQuizButton = document.getElementById('submitQuizButton'); // New
    const quizScore = document.getElementById('quizScore');             // New
    const loadingOverlay = document.getElementById('loadingOverlay');
    const loadingMessage = document.getElementById('loadingMessage');

    let uploadedPdfText = ''; // To store the extracted text from PDF
    let currentQuizData = null; // To store the generated quiz data

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
        currentQuizData = quizData; // Store quiz data

        if (!quizData || !quizData.questions || quizData.questions.length === 0) {
            quizOutput.innerHTML = '<p>No quiz questions generated.</p>';
            return;
        }

        // // Removed dynamic title as per user's request to keep static "Interactive Quiz"
        // const quizTitle = document.createElement('h3');
        // quizTitle.textContent = quizData.title;
        // quizOutput.appendChild(quizTitle);

        quizData.questions.forEach((q, index) => {
            const questionElement = document.createElement('div');
            questionElement.classList.add('quiz-question');
            questionElement.dataset.questionIndex = index; // Store index for easy lookup

            const questionText = q.question || q.question_with_blank;
            questionElement.innerHTML = `<p><strong>${index + 1}. ${questionText}</strong></p>`;

            if (q.type === 'mcq' && q.options) {
                const optionsList = document.createElement('div');
                optionsList.classList.add('mcq-options');
                q.options.forEach(option => {
                    const optionLabel = document.createElement('label');
                    optionLabel.classList.add('quiz-option');
                    optionLabel.innerHTML = `
                        <input type="radio" name="question-${index}" value="${option.id}">
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
                trueLabel.innerHTML = `<input type="radio" name="question-${index}" value="true"> <span>True</span>`;
                optionsList.appendChild(trueLabel);

                const falseLabel = document.createElement('label');
                falseLabel.classList.add('quiz-option');
                falseLabel.innerHTML = `<input type="radio" name="question-${index}" value="false"> <span>False</span>`;
                optionsList.appendChild(falseLabel);
                questionElement.appendChild(optionsList);
            } else if (q.type === 'fill_in_the_blank') {
                const inputField = document.createElement('input');
                inputField.type = 'text';
                inputField.classList.add('fill-in-the-blank-input');
                inputField.placeholder = 'Your answer';
                questionElement.appendChild(inputField);
            }
            quizOutput.appendChild(questionElement);
        });
        showElement(submitQuizButton); // Show submit button after quiz renders
        hideElement(quizScore); // Hide score until submitted
    };

    // Function to check answers and display results
    const checkAnswers = () => {
        if (!currentQuizData) return;

        let score = 0;
        const totalQuestions = currentQuizData.questions.length;

        currentQuizData.questions.forEach((q, index) => {
            const questionElement = quizOutput.querySelector(`div[data-question-index="${index}"]`);
            let isCorrect = false;
            let userAnswer = '';
            
            // Disable all inputs after submission
            questionElement.querySelectorAll('input').forEach(input => input.disabled = true);

            if (q.type === 'mcq') {
                const selectedOption = questionElement.querySelector(`input[name="question-${index}"]:checked`);
                if (selectedOption) {
                    userAnswer = selectedOption.value;
                    isCorrect = (userAnswer === q.correct_answer_id);
                }
            } else if (q.type === 'true_false') {
                const selectedOption = questionElement.querySelector(`input[name="question-${index}"]:checked`);
                if (selectedOption) {
                    userAnswer = selectedOption.value === 'true'; // Convert string to boolean
                    isCorrect = (userAnswer === q.correct_answer);
                }
            } else if (q.type === 'fill_in_the_blank') {
                const inputField = questionElement.querySelector('.fill-in-the-blank-input');
                userAnswer = inputField.value.trim();
                isCorrect = (userAnswer.toLowerCase() === q.correct_answer.toLowerCase());
            }

            if (isCorrect) {
                score++;
                questionElement.classList.add('correct-answer-highlight');
            } else {
                questionElement.classList.add('incorrect-answer-highlight');
                // Display correct answer and highlight the correct option
                const correctAnswerDisplay = document.createElement('p');
                correctAnswerDisplay.classList.add('correct-feedback'); // Apply class for styling
                
                if (q.type === 'mcq') {
                    const correctOption = q.options.find(opt => opt.id === q.correct_answer_id);
                    if (correctOption) {
                        correctAnswerDisplay.innerHTML = `Correct Answer: <strong>${correctOption.text}</strong>`;
                        // Highlight the correct option visually
                        const correctOptionLabel = questionElement.querySelector(`input[name="question-${index}"][value="${correctOption.id}"]`).closest('.quiz-option');
                        if (correctOptionLabel) {
                            correctOptionLabel.classList.add('correct-option-highlight');
                        }
                    } else {
                        correctAnswerDisplay.textContent = `Correct Answer: N/A`;
                    }
                } else if (q.type === 'true_false') {
                    correctAnswerDisplay.innerHTML = `Correct Answer: <strong>${q.correct_answer ? 'True' : 'False'}</strong>`;
                    // Highlight the correct option visually
                    const correctValue = q.correct_answer ? 'true' : 'false';
                    const correctOptionLabel = questionElement.querySelector(`input[name="question-${index}"][value="${correctValue}"]`).closest('.quiz-option');
                    if (correctOptionLabel) {
                        correctOptionLabel.classList.add('correct-option-highlight');
                    }
                } else if (q.type === 'fill_in_the_blank') {
                    correctAnswerDisplay.innerHTML = `Correct Answer: <strong>${q.correct_answer}</strong>`;
                }
                questionElement.appendChild(correctAnswerDisplay);
            }
        });

        showElement(quizScore);
        quizScore.innerHTML = `You scored ${score} out of ${totalQuestions}!`;
        submitQuizButton.disabled = true; // Prevent re-submission
    };


    // Initial state
    hideElement(summarySection);
    hideElement(quizSection);
    hideElement(generateQuizButton);
    hideElement(submitQuizButton); // Hide submit button initially
    hideElement(quizScore);        // Hide score initially

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
        hideElement(submitQuizButton); // Ensure hidden
        hideElement(quizScore);        // Ensure hidden
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
            hideElement(submitQuizButton);
            hideElement(quizScore);
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
        hideElement(submitQuizButton); // Ensure submit button is hidden during generation
        hideElement(quizScore);        // Ensure score is hidden during generation
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
            hideElement(submitQuizButton);
            hideElement(quizScore);
        } finally {
            hideLoading();
        }
    });

    submitQuizButton.addEventListener('click', checkAnswers); // Event listener for submit button
});

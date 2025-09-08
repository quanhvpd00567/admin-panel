import React, { useState } from 'react';
import Step1 from './steps/Step1';
import Step2 from './steps/Step2';
import Step2_1 from './steps/Step2_1'; // Import Step2_1
import Step3 from './steps/Step3';
import Step4 from './steps/Step4';
import 'react-datepicker/dist/react-datepicker.css';


const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Dễ' },
  { value: 'medium', label: 'Trung bình' },
  { value: 'hard', label: 'Khó' },
];

const CreateQuizV1 = () => {
  const [step, setStep] = useState(1);
  const [basic, setBasic] = useState({
    title: '',
    description: '',
    class: '',
    subject: '',
    difficulty: DIFFICULTY_OPTIONS[0].value,
    estimatedTime: 30,
    timeLimit: 60,
    instructions: '',
    passingScore: 70,
    maxAttempts: 1,
    isActive: true,
    isPublic: true,
    shuffleQuestions: false,
    shuffleAnswers: false,
    showResultsImmediately: true,
    deadline: null,
    tags: [],
    questions: [],
  });
  const [questionSource, setQuestionSource] = useState('manual');

  const renderStepIndicator = () => (
    <div className="relative flex items-center justify-between mb-8">
      {/* Line connecting steps */}
      <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-300 dark:bg-gray-600 z-0"></div>
      {[
        { step: 1, label: 'Thông tin cơ bản', icon: '⚙️' },
        { step: 2, label: 'Tạo câu hỏi', icon: '🧠' },
        { step: 2.1, label: 'Chọn câu hỏi', icon: '✅' },
        { step: 3, label: 'Xem trước', icon: '👁️' },
        { step: 4, label: 'Xuất bài', icon: '⬇️' },
      ].map(({ step: s, label, icon }, index) => (
        <div
          key={s}
          className={`relative z-10 flex flex-col items-center ${
            step === s ? 'text-purple-600' : 'text-gray-400'
          }`}
        >
          <div
            className={`w-12 h-12 flex items-center justify-center rounded-full border-2 ${
              step === s ? 'border-purple-600 bg-purple-100' : 'border-gray-300 bg-gray-100'
            }`}
          >
            <span className="text-lg">{icon}</span>
          </div>
          <span className="mt-2 text-sm font-medium">{label}</span>
          {/* Line segment between steps */}
          {index < 4 && (
            <div className="absolute top-6 left-full w-full h-0.5 bg-gray-300 dark:bg-gray-600"></div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-8">
      {renderStepIndicator()}
      {step === 1 && (
        <Step1
          basic={basic}
          setBasic={setBasic}
          onNext={() => setStep(2)}
          DIFFICULTY_OPTIONS={DIFFICULTY_OPTIONS}
        />
      )}
      {step === 2 && (
        <Step2
          basic={basic}
          questionSource={questionSource}
          setQuestionSource={setQuestionSource}
          onNext={() => setStep(2.1)} // Chuyển đến Step2_1 khi chọn "Tạo thủ công"
          onBack={() => setStep(1)}
        />
      )}
      {step === 2.1 && (
        <Step2_1
          basic={basic}
          onNext={(updatedBasic) => {
            setBasic(updatedBasic); // Cập nhật basic với questions đã chọn
            setStep(3); // Chuyển sang Step3
          }}
          onBack={() => setStep(2)}
        />
      )}
      {step === 3 && (
        <Step3
          basic={basic} // Truyền basic (bao gồm questions) sang Step3
          onNext={() => setStep(4)}
          onBack={(updatedBasic) => {
            setBasic(updatedBasic); // Cập nhật basic khi quay lại Step2_1
            setStep(2.1);
          }}
        />
      )}
      {step === 4 && (
        <Step4
          basic={basic}
          onBack={() => setStep(3)}
          selectedQuestions={[]}
          DIFFICULTY_OPTIONS={DIFFICULTY_OPTIONS}
        />
      )}
    </div>
  );
};

export default CreateQuizV1;

import { jsPDF } from 'jspdf';

export const generatePDF = (quizData) => {
  const doc = new jsPDF();

  // Tiêu đề
  doc.setFontSize(18);
  doc.text('Thông tin bài kiểm tra', 10, 10);

  // Nội dung
  doc.setFontSize(12);
  doc.text(`Tên Quiz: ${quizData.title || 'Không có'}`, 10, 20);
  doc.text(`Mô tả: ${quizData.description || 'Không có'}`, 10, 30);
  doc.text(`Lớp: ${quizData.class || 'Không xác định'}`, 10, 40);
  doc.text(`Chủ đề: ${quizData.subject || 'Không có'}`, 10, 50);
  doc.text(`Thời gian: ${quizData.timeLimit || 0} phút`, 10, 60);
  doc.text(`Điểm đạt: ${quizData.passingScore || 0}%`, 10, 70);
  doc.text(`Số lần làm tối đa: ${quizData.maxAttempts || 0}`, 10, 80);

  // Danh sách câu hỏi
  doc.text('Danh sách câu hỏi:', 10, 90);
  quizData.questions.forEach((question, index) => {
    doc.text(`${index + 1}. ${question.title || 'Không có tiêu đề'}`, 10, 100 + index * 10);
  });

  // Xuất file
  doc.save('quiz-example.pdf');
};

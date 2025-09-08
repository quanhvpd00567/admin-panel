import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  FaArrowLeft,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
  FaClock,
  FaUser,
  FaCalendarAlt,
} from "react-icons/fa"
import { showToast } from "../../components/ui/Toast"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import Badge from "../../components/ui/Badge"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import { ConfirmModal } from "../../components/ui/Modal"
import questionAPI from "../../services/questions/questionAPI"
import { getClassNameByCode } from "../../constants/classes"

const QuestionDetail = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const [question, setQuestion] = useState(null)
  const [loading, setLoading] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)

  // Question type configurations
  const questionTypes = {
    true_false: { label: "True/False", color: "blue" },
    multiple_choice: { label: "Multiple Choice", color: "green" },
    single_choice: { label: "Single Choice", color: "orange" },
    fill_blank: { label: "Fill in the Blank", color: "purple" },
  }

  const difficultyLevels = {
    easy: { label: "Easy", color: "green" },
    medium: { label: "Medium", color: "orange" },
    hard: { label: "Hard", color: "red" },
  }

  // Load question details
  useEffect(() => {
    if (!id) return

    const abortController = new AbortController()

    const loadQuestion = async () => {
      setLoading(true)
      try {
        const response = await questionAPI.getQuestion(id, { signal: abortController.signal })

        if (response.success) {
          setQuestion(response.data)
        } else {
          showToast.error(response.error || "Failed to load question")
          navigate("/questions")
        }
      } catch (error) {
        if (error.name === "AbortError") {
          return // Request was cancelled, don't show error
        }

        showToast.error("Error loading question")
        navigate("/questions")
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadQuestion()

    return () => {
      abortController.abort()
    }
  }, [id, navigate]) // Added navigate to dependency array to fix ESLint warning

  // Handle delete question
  const handleDelete = async () => {
    try {
      const response = await questionAPI.deleteQuestion(id)
      if (response.success) {
        showToast.success("Question deleted successfully")
        navigate("/questions")
      } else {
        showToast.error(response.error || "Failed to delete question")
      }
    } catch (error) {
      showToast.error("Error deleting question")
    }
    setDeleteModal(false)
  }

  if (loading) {
    return (
      <div className="p-6">
        <Card className="text-center py-8">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading question details...</p>
        </Card>
      </div>
    )
  }

  if (!question) {
    return (
      <div className="p-6">
        <Card className="text-center py-8">
          <p className="text-gray-600">Question not found</p>
          <Button variant="outline" onClick={() => navigate("/questions")} className="mt-4">
            <FaArrowLeft className="mr-2" />
            Back to Questions
          </Button>
        </Card>
      </div>
    )
  }

  const typeConfig = questionTypes[question.type] || { label: question.type, color: "gray" }
  const diffConfig = difficultyLevels[question.difficulty] || { label: question.difficulty, color: "gray" }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-6">
        {/* Breadcrumb */}
        <nav className="mb-4">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <button onClick={() => navigate("/questions")} className="hover:text-blue-600 transition-colors">
                Questions
              </button>
            </li>
            <li>/</li>
            <li className="text-gray-900 dark:text-white font-medium">Question #{question?.id || id}</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <div className="flex items-center">
            <Button variant="outline" onClick={() => navigate("/questions")} className="mr-4">
              <FaArrowLeft className="mr-2" />
              Back to Questions
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Question Details</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                ID: {question?._id} • {typeConfig.label} • {diffConfig.label}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="primary" onClick={() => navigate(`/questions/${id}/edit`)}>
              <FaEdit className="mr-2" />
              Edit Question
            </Button>
            <Button variant="danger" onClick={() => setDeleteModal(true)}>
              <FaTrash className="mr-2" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Question Content */}
          <div className="lg:col-span-2">
            <Card title="Question Content" className="mb-4">
              {/* Question Title */}
              {question.title && (
                <div className="mb-4">
                  <p className="font-bold text-left text-gray-900 dark:text-white mb-2 text-sm uppercase tracking-wide">
                    Title:
                  </p>
                  <h2 className="text-xl font-medium text-gray-900 dark:text-white">{question.title}</h2>
                </div>
              )}

              {/* Question Text/Content */}
              <div className="mb-4">
                <p className="font-bold text-left text-gray-900 dark:text-white mb-2 text-sm uppercase tracking-wide">
                  Question Content:
                </p>
                <div
                  className="text-lg text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border-l-4 border-blue-500"
                  style={{ textAlign: "left" }}
                  dangerouslySetInnerHTML={{
                    __html: question.content || '<p class="text-gray-400 italic">No content to preview</p>',
                  }}
                />
              </div>

              <div className="border-t pt-4">
                <p className="text-left font-bold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wide">
                  Answer Options:
                </p>
                <div>
                  {!question.answers || question.answers.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>No answer options available for this question.</p>
                    </div>
                  ) : question.type === "fill_blank" ? (
                    <div>
                      <p className="text-sm font-semibold text-green-700 dark:text-green-400 mb-3">Correct Answers:</p>
                      <div className="space-y-2">
                        {(question.answers || [])
                          .filter((answer) => answer.isCorrect)
                          .map((answer, index) => (
                            <div
                              key={index}
                              className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg"
                            >
                              <FaCheckCircle className="text-green-500 mr-3 flex-shrink-0" />
                              <span className="font-medium text-green-800">{answer.text}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {(question.answers || []).map((answer, index) => (
                        <div
                          key={index}
                          className={`flex items-center p-4 border rounded-lg transition-colors ${
                            answer.isCorrect
                              ? "bg-green-50 border-green-200 hover:bg-green-100"
                              : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                          }`}
                        >
                          <div className="flex items-center mr-3">
                            {answer.isCorrect ? (
                              <FaCheckCircle className="text-green-500 text-lg" />
                            ) : (
                              <FaTimesCircle className="text-red-500 text-lg" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span
                                className={`${answer.isCorrect ? "font-semibold text-green-700" : "text-gray-700"}`}
                              >
                                <span className="font-bold mr-2">{String.fromCharCode(65 + index)}.</span>
                                {answer.text}
                              </span>
                              {answer.isCorrect && (
                                <Badge color="green" size="sm">
                                  Correct
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {question.explanation && (
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center mb-2">
                    <FaInfoCircle className="text-blue-500 mr-2" />
                    <p className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wide">
                      Explanation:
                    </p>
                  </div>
                  <div className="text-left bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                    <div
                      className="text-yellow-800"
                      style={{ textAlign: "left" }}
                      dangerouslySetInnerHTML={{
                        __html: question.explanation || '<p class="text-gray-400 italic">No content to preview</p>',
                      }}
                    />
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Right Column - Question Metadata */}
          <div>
            <Card title="Question Information" className="mb-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-gray-900 dark:text-white text-sm">Type:</p>
                  <Badge color={typeConfig.color}>{typeConfig.label}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <p className="font-bold text-gray-900 dark:text-white text-sm">Subject:</p>
                  <p className="text-sm">{question.subject?.name || "N/A"}</p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="font-bold text-gray-900 dark:text-white text-sm">Class:</p>
                  <p className="text-sm">{getClassNameByCode(question.class) || "N/A"}</p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="font-bold text-gray-900 dark:text-white text-sm">Difficulty:</p>
                  <Badge color={diffConfig.color}>{diffConfig.label}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <p className="font-bold text-gray-900 dark:text-white text-sm">Points:</p>
                  <p className="text-sm font-medium">
                    {question.points || 0} point{(question.points || 0) !== 1 ? "s" : ""}
                  </p>
                </div>

                <div className="border-t pt-4">
                  <div className="mb-3">
                    <div className="flex items-center mb-1">
                      <FaCalendarAlt className="text-blue-500 mr-2 text-sm" />
                      <p className="font-bold text-gray-900 dark:text-white text-sm">Created:</p>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 ml-6">
                      {question.createdAt
                        ? new Date(question.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "N/A"}
                    </p>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center mb-1">
                      <FaClock className="text-green-500 mr-2 text-sm" />
                      <p className="font-bold text-gray-900 dark:text-white text-sm">Last Updated:</p>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 ml-6">
                      {question.updatedAt
                        ? new Date(question.updatedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "N/A"}
                    </p>
                  </div>

                  {question.createdBy && (
                    <div>
                      <div className="flex items-center mb-1">
                        <FaUser className="text-purple-500 mr-2 text-sm" />
                        <p className="font-bold text-gray-900 dark:text-white text-sm">Created By:</p>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 ml-6">
                        {question.createdBy.name || question.createdBy.username}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Statistics Card */}
            <Card title="Question Statistics">
              <div className="grid grid-cols-2 gap-4 text-center mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{question.answers?.length || 0}</div>
                  <div className="text-xs text-gray-600">Total Options</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {question.answers?.filter((a) => a.isCorrect).length || 0}
                  </div>
                  <div className="text-xs text-gray-600">Correct Options</div>
                </div>
              </div>

              {/* Content Statistics */}
              <div className="border-t pt-4">
                <h4 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wide mb-3">
                  Content Analysis:
                </h4>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-2 bg-purple-50 rounded">
                    <div className="text-lg font-bold text-purple-600">
                      {question.text ? question.text.split(" ").length : 0}
                    </div>
                    <div className="text-xs text-gray-600">Words</div>
                  </div>
                  <div className="p-2 bg-orange-50 rounded">
                    <div className="text-lg font-bold text-orange-600">{question.text ? question.text.length : 0}</div>
                    <div className="text-xs text-gray-600">Characters</div>
                  </div>
                </div>
              </div>

              {/* Question Type Info */}
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wide mb-2">
                  Question Type Info:
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {question.type === "true_false" && "Students answer True or False"}
                  {question.type === "single_choice" && "Students select one correct answer"}
                  {question.type === "multiple_choice" && "Students can select multiple correct answers"}
                  {question.type === "fill_blank" && "Students fill in the blank with correct text"}
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={deleteModal}
          onClose={() => setDeleteModal(false)}
          onConfirm={handleDelete}
          title="Delete Question"
          message="Are you sure you want to delete this question? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
        />
      </div>
    </div>
  )
}

export default QuestionDetail

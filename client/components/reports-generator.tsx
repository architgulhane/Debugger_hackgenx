"use client"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Label } from "../components/ui/label"
import { Checkbox } from "../components/ui/checkbox"
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"
import { Check, Send } from "lucide-react"

export function FeedbackForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    feedbackType: "suggestion",
    satisfaction: "5",
    message: "",
    contactPermission: false,
  })
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: string, value: string | boolean) => {
    setFormData({
      ...formData,
      [field]: value,
    })
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: "",
      })
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.message.trim()) {
      newErrors.message = "Feedback message is required"
    }
    if (formData.contactPermission && !formData.email.trim()) {
      newErrors.email = "Email is required if you want us to contact you"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      console.log("Form submitted:", formData)
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <Alert className="border-green-200 bg-green-50">
          <Check className="h-4 w-4 text-green-600" />
          <AlertTitle>Thank you for your feedback!</AlertTitle>
          <AlertDescription>
            We appreciate you taking the time to share your thoughts with us.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Feedback Form</h2>
        <p className="text-gray-600">We'd love to hear your thoughts about our service</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Name (Optional)</Label>
          <Input
            id="name"
            placeholder="Your name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email (Optional)</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>

        {/* Feedback Type */}
        <div className="space-y-2">
          <Label>Type of Feedback</Label>
          <div className="flex gap-4">
            {[
              { value: "suggestion", label: "Suggestion" },
              { value: "bug", label: "Bug Report" },
              { value: "compliment", label: "Compliment" },
            ].map((type) => (
              <div key={type.value} className="flex items-center gap-2">
                <input
                  type="radio"
                  id={type.value}
                  name="feedbackType"
                  value={type.value}
                  checked={formData.feedbackType === type.value}
                  onChange={() => handleChange("feedbackType", type.value)}
                  className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor={type.value}>{type.label}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Satisfaction */}
        <div className="space-y-2">
          <Label>Satisfaction Level</Label>
          <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} className="flex flex-col items-center">
                <input
                  type="radio"
                  value={num.toString()}
                  id={`rating-${num}`}
                  name="satisfaction"
                  checked={formData.satisfaction === num.toString()}
                  onChange={() => handleChange("satisfaction", num.toString())}
                  className="h-5 w-5 border-gray-300 text-primary focus:ring-primary cursor-pointer"
                />
                <Label htmlFor={`rating-${num}`} className="mt-1 text-sm font-medium text-gray-700">
                  {num}
                </Label>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span className="italic">Not satisfied</span>
            <span className="italic">Very satisfied</span>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <Label htmlFor="message">Your Feedback*</Label>
          <Textarea
            id="message"
            placeholder="Please share your detailed feedback..."
            rows={5}
            value={formData.message}
            onChange={(e) => handleChange("message", e.target.value)}
            className={errors.message ? "border-red-500" : ""}
          />
          {errors.message && <p className="text-sm text-red-500">{errors.message}</p>}
        </div>

        {/* Contact Permission */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="contactPermission"
            checked={formData.contactPermission}
            onCheckedChange={(checked) => handleChange("contactPermission", checked as boolean)}
          />
          <Label htmlFor="contactPermission">
            I agree to be contacted for follow-up regarding my feedback
          </Label>
        </div>

        <div className="pt-4">
          <Button type="submit" className="w-full">
            <Send className="mr-2 h-4 w-4" />
            Submit Feedback
          </Button>
        </div>

        <p className="text-xs text-gray-500">
          * Required field. Your feedback helps us improve our services.
        </p>
      </form>
    </div>
  )
}
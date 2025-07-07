"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { submitContactForm } from "../actions"

export default function ContactForm() {
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  async function handleSubmit(formData: FormData) {
    setPending(true)
    setMessage("")
    setError("")
    
    try {
      const response = await submitContactForm(formData)
      
      if (response.error) {
        setError(response.error)
      } else if (response.message) {
        setMessage(response.message)
        // Reset form on success
        const form = document.querySelector('form') as HTMLFormElement
        form?.reset()
      }
    } catch (error) {
      setError("Something went wrong. Please try again.")
    } finally {
      setPending(false)
    }
  }

  return (
    <Card className="p-6">
      <form action={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Name *
          </label>
          <Input 
            id="name" 
            name="name" 
            required 
            placeholder="Your full name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email *
          </label>
          <Input 
            id="email" 
            name="email" 
            type="email" 
            required 
            placeholder="your.email@example.com"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-2">
            Message *
          </label>
          <Textarea 
            id="message" 
            name="message" 
            required 
            rows={5}
            placeholder="Tell me about your project or just say hello!"
          />
        </div>
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Sending..." : "Send Message"}
        </Button>
        
        {message && (
          <div className="text-sm text-center mt-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 dark:bg-green-950 dark:border-green-800 dark:text-green-300">
            {message}
          </div>
        )}
        
        {error && (
          <div className="text-sm text-center mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 dark:bg-red-950 dark:border-red-800 dark:text-red-300">
            {error}
          </div>
        )}
      </form>
    </Card>
  )
}
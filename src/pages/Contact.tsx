import React, { useState } from 'react';
import { Send, MapPin, Phone, Mail } from 'lucide-react';

export function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    setTimeout(() => setSubmitted(true), 500);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Public Inquiries & Feedback</h1>
          <p className="text-lg text-gray-600">
            We value your feedback. Use this portal to submit inquiries, suggestions, or complaints to the County Government.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>
              <ul className="space-y-6">
                <li className="flex items-start">
                  <div className="p-3 bg-green-50 rounded-lg text-green-600 mr-4">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Headquarters</h4>
                    <p className="text-gray-600 text-sm">County Headquarters, Wundanyi<br/>P.O. Box 1062 - 80304,<br/>Wundanyi, Kenya</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="p-3 bg-green-50 rounded-lg text-green-600 mr-4">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                    <p className="text-gray-600 text-sm">+254 (0) 700 000 000</p>
                    <p className="text-gray-500 text-xs mt-1">Mon-Fri, 8am to 5pm</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="p-3 bg-green-50 rounded-lg text-green-600 mr-4">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                    <p className="text-gray-600 text-sm">info@taitataveta.go.ke</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10">
              {submitted ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Send className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent Successfully</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">Thank you for reaching out to the County Government of Taita Taveta. We will review your submission and get back to you shortly.</p>
                  <button 
                    onClick={() => { setSubmitted(false); setFormData({name: '', email: '', subject: '', message: ''}); }}
                    className="px-6 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Send us a Message</h3>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input 
                          type="text" 
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-shadow"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input 
                          type="email" 
                          id="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-shadow"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                      <select 
                        id="subject"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-shadow bg-white"
                      >
                        <option value="">Select a subject...</option>
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Complaint">Complaint</option>
                        <option value="Feedback/Suggestion">Feedback / Suggestion</option>
                        <option value="Tenders/Procurement">Tenders & Procurement</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                      <textarea 
                        id="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-shadow resize-none"
                        placeholder="How can we help you?"
                      ></textarea>
                    </div>
                    <button 
                      type="submit"
                      className="w-full py-3.5 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors shadow-sm flex items-center justify-center"
                    >
                      Submit Inquiry <Send className="w-4 h-4 ml-2" />
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

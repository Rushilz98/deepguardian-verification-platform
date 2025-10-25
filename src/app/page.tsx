"use client"

import { useState } from "react"
import { Shield, Image as ImageIcon, Mic, Video, AlertTriangle, Users, Upload, BarChart3, Share2, Play, Check, Lock, Zap, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import SignupModal from "@/components/SignupModal"

export default function LandingPage() {
  const [isSignupOpen, setIsSignupOpen] = useState(false)

  const features = [
    {
      icon: ImageIcon,
      title: "Image Verification",
      description: "Detect AI-altered images with 99.2% accuracy",
      color: "text-green-600",
      bgColor: "bg-green-50",
      demo: "Pixel-level manipulation detection"
    },
    {
      icon: Mic,
      title: "Audio Verification",
      description: "Unmask synthetic voices in real-time",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      demo: "Voice cloning identification"
    },
    {
      icon: Video,
      title: "Deepfake Detection",
      description: "Analyze videos for generative AI manipulation",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      demo: "Frame-by-frame analysis"
    },
    {
      icon: AlertTriangle,
      title: "Misinformation Detector",
      description: "Flag false claims across social media & news",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      demo: "Real-time fact-checking"
    },
    {
      icon: Users,
      title: "Team Management",
      description: "Collaborate with role-based access controls",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      demo: "Shared verification workflows"
    }
  ]

  const steps = [
    {
      number: 1,
      title: "Upload",
      description: "Drag any file: images, audio, videos, or text",
      icon: Upload,
      color: "bg-purple-600"
    },
    {
      number: 2,
      title: "Analyze",
      description: "AI-powered verification with instant results",
      icon: BarChart3,
      color: "bg-green-600"
    },
    {
      number: 3,
      title: "Collaborate",
      description: "Share reports with your team in one click",
      icon: Share2,
      color: "bg-blue-600"
    }
  ]

  const testimonials = [
    {
      quote: "DeepGuardian cut our misinformation response time by 70%.",
      author: "Sarah K.",
      role: "CISO @ Fortune 500"
    },
    {
      quote: "The audio verification saved us from a major brand crisis.",
      author: "Mark T.",
      role: "Media Director"
    }
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] px-4 py-20 md:py-32">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />
        </div>
        
        <div className="relative mx-auto max-w-7xl">
          {/* Logo */}
          <div className="mb-12 flex items-center justify-center gap-3 md:justify-start">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 shadow-lg">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">DeepGuardian</h2>
              <p className="text-xs text-gray-400">Verification as a Service</p>
            </div>
          </div>

          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left: Hero Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
                Stop AI Fraud Before It Spreads
              </h1>
              <p className="mt-6 text-lg text-gray-300 md:text-xl lg:text-2xl">
                Enterprise-grade verification for images, audio, deepfakes, and misinformation – with team collaboration
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                <Button 
                  size="lg"
                  className="bg-[#7C3AED] px-8 py-6 text-lg font-semibold text-white hover:bg-[#6D28D9]"
                  onClick={() => setIsSignupOpen(true)}
                >
                  Start Free Trial →
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-gray-600 bg-transparent px-8 py-6 text-lg font-semibold text-white hover:bg-white/10"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo (60s)
                </Button>
              </div>

              {/* Trust Badge */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400 lg:justify-start">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Trusted by 500+ enterprises</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  <span>SOC 2 Certified</span>
                </div>
              </div>
            </div>

            {/* Right: Dashboard Mockup */}
            <div className="relative">
              <div className="overflow-hidden rounded-2xl border border-gray-700 bg-white shadow-2xl">
                <div className="border-b border-gray-200 bg-[#0F172A] p-3">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <div className="h-4 w-32 rounded bg-gray-200" />
                  </div>
                  <Card className="border-green-200 bg-green-50 p-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-green-600 p-2">
                        <Check className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-green-900">Authentic Content</h3>
                        <p className="mt-1 text-sm text-green-700">98.5% confidence</p>
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-green-700">AI-Generated Likelihood</span>
                            <span className="font-semibold text-green-900">1.5%</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-green-200">
                            <div className="h-full w-[2%] bg-green-600" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
              <div className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-purple-600/20 blur-3xl" />
              <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-blue-600/20 blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#0F172A] md:text-4xl lg:text-5xl">
              Verify Anything. Stop Misinformation.
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Enterprise-grade tools trusted by security teams worldwide
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card 
                  key={index}
                  className="group cursor-pointer border-2 p-6 transition-all hover:border-[#7C3AED] hover:shadow-xl"
                >
                  <div className={`inline-flex rounded-xl ${feature.bgColor} p-3`}>
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-[#0F172A]">{feature.title}</h3>
                  <p className="mt-2 text-gray-600">{feature.description}</p>
                  <div className="mt-4 opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                      <p className="text-xs font-medium text-gray-700">{feature.demo}</p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          {/* CTA in Features */}
          <div className="mt-12 text-center">
            <Button 
              size="lg"
              className="bg-[#7C3AED] px-8 py-6 text-lg font-semibold text-white hover:bg-[#6D28D9]"
              onClick={() => setIsSignupOpen(true)}
            >
              Start Free Trial →
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#0F172A] md:text-4xl lg:text-5xl">
              Three Steps to Verified Content
            </h2>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={index} className="relative">
                  {index < steps.length - 1 && (
                    <div className="absolute left-1/2 top-16 hidden h-0.5 w-full border-t-2 border-dashed border-gray-300 md:block" />
                  )}
                  <Card className="relative z-10 border-2 p-6 text-center">
                    <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${step.color} text-2xl font-bold text-white`}>
                      {step.number}
                    </div>
                    <div className="mt-4">
                      <Icon className="mx-auto h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="mt-4 text-xl font-bold text-[#0F172A]">{step.title}</h3>
                    <p className="mt-2 text-gray-600">{step.description}</p>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-7xl">
          {/* Testimonials */}
          <div className="mb-16 grid gap-6 md:grid-cols-2">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-2 p-8">
                <div className="mb-4 text-4xl text-[#7C3AED]">"</div>
                <p className="text-lg text-gray-700">{testimonial.quote}</p>
                <div className="mt-6">
                  <p className="font-semibold text-[#0F172A]">{testimonial.author}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Trust Logos */}
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Trusted by
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-8">
              {["NewsCorp", "GlobalBank", "TechCorp", "MediaGroup", "SecureNet"].map((company, index) => (
                <div key={index} className="text-2xl font-bold text-gray-400">
                  {company}
                </div>
              ))}
            </div>
          </div>

          {/* Security Badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-green-600" />
              <span>End-to-end encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-600" />
              <span>GDPR compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-600" />
              <span>99.9% uptime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            Join 500+ organizations fighting AI fraud today
          </h2>
          <p className="mt-6 text-xl text-purple-100">
            Start your free 14-day trial. No credit card required.
          </p>
          <Button 
            size="lg"
            className="mt-8 bg-white px-8 py-6 text-lg font-semibold text-[#7C3AED] hover:bg-gray-100"
            onClick={() => setIsSignupOpen(true)}
          >
            Start Free Trial (14 days)
          </Button>
          <p className="mt-4 text-sm text-purple-200">
            No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F172A] px-4 py-12 text-gray-400">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-4">
            {/* Logo & Tagline */}
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-700">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">DeepGuardian</h3>
                  <p className="text-xs">Verification as a Service</p>
                </div>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="mb-4 font-semibold text-white">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Demo</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="mb-4 font-semibold text-white">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="mb-4 font-semibold text-white">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm">
            <p>© 2024 DeepGuardian. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Signup Modal */}
      <SignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} />
    </div>
  )
}
import Link from "next/link"
import Button from "@/components/Button"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-n-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-n-1 mb-4">
            Access Denied
          </h1>
          <p className="text-n-4 mb-6">
            You don't have permission to access this page. This area is restricted to Collabs customers only.
          </p>
        </div>

        <div className="space-y-4">
          <Button as="link" href="/login" className="w-full">
            Sign In with Customer Account
          </Button>
          
          <Button as="link" href="/" isGray className="w-full">
            Go to Homepage
          </Button>
        </div>
      </div>
    </div>
  )
} 
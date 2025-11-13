import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-2xl font-bold">PTracker</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4">
        <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Welcome to PTracker!</CardTitle>
              <CardDescription>You have successfully logged in to your account.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  This is a protected page that can only be accessed by authenticated users. Your
                  account information:
                </p>
                <div className="rounded-lg border p-4">
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm font-medium">Email:</dt>
                      <dd className="text-sm text-muted-foreground">{user?.email}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium">Status:</dt>
                      <dd className="text-sm text-muted-foreground">Authenticated</dd>
                    </div>
                  </dl>
                </div>
                <p className="text-sm text-muted-foreground">
                  You can now start using the application. If you log out, you will be redirected
                  back to the login page and will need to authenticate again to access this page.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

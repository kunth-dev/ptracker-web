import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { logout } from '@/store/authSlice'
import { userService } from '@/services'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { User } from '@/types'

export default function Home() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user: authUser } = useAppSelector((state) => state.auth)

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      if (!authUser?.userId) return

      try {
        setLoading(true)
        const response = await userService.getUser(authUser.userId)
        if (response.success && response.data) {
          setUser(response.data)
        }
      } catch (err) {
        setError('Failed to load user information')
        console.error('Error fetching user data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [authUser])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ru' : 'en'
    i18n.changeLanguage(newLang)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-2xl font-bold">PTracker</h1>
          <div className="flex items-center gap-4">
            <Button onClick={toggleLanguage} variant="ghost" size="sm">
              {i18n.language === 'en' ? '🇷🇺 RU' : '🇬🇧 EN'}
            </Button>
            <span className="text-sm text-muted-foreground">{user?.email || authUser?.email}</span>
            <Button onClick={handleLogout} variant="outline">
              {t('auth.logout')}
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4">
        <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>{t('home.welcome')}</CardTitle>
              <CardDescription>
                {user?.email
                  ? t('home.welcomeBack', { email: user.email })
                  : t('home.dashboard')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-sm text-muted-foreground">{t('home.loading')}</p>
              ) : error ? (
                <p className="text-sm text-destructive">{error}</p>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    This is a protected page that can only be accessed by authenticated users.
                  </p>
                  <div className="rounded-lg border p-4">
                    <dl className="space-y-2">
                      <div>
                        <dt className="text-sm font-medium">{t('auth.email')}:</dt>
                        <dd className="text-sm text-muted-foreground">{user?.email}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium">User ID:</dt>
                        <dd className="text-sm text-muted-foreground">{user?.userId}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium">Created At:</dt>
                        <dd className="text-sm text-muted-foreground">
                          {user?.createdAt &&
                            new Date(user.createdAt).toLocaleString(i18n.language)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium">Updated At:</dt>
                        <dd className="text-sm text-muted-foreground">
                          {user?.updatedAt &&
                            new Date(user.updatedAt).toLocaleString(i18n.language)}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

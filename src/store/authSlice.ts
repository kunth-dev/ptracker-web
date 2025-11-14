import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { authService } from '@/services'
import { apiService } from '@/services/api'
import type { 
  AuthState, 
  User, 
  LoginRequest, 
  RegisterRequest, 
  ResetPasswordRequest,
  VerifyEmailRequest,
  ResendVerificationCodeRequest
} from '@/types'

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials)
      if (response.success && response.data) {
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(response.data))
        return response.data
      }
      return rejectWithValue('Login failed')
    } catch (error) {
      return rejectWithValue(apiService.getErrorMessage(error))
    }
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (data: RegisterRequest, { rejectWithValue }) => {
    try {
      const response = await authService.register(data)
      if (response.success && response.data) {
        return response.data
      }
      return rejectWithValue('Registration failed')
    } catch (error) {
      return rejectWithValue(apiService.getErrorMessage(error))
    }
  }
)

export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (data: VerifyEmailRequest, { rejectWithValue }) => {
    try {
      const response = await authService.verifyEmail(data)
      if (response.success) {
        return true
      }
      return rejectWithValue('Email verification failed')
    } catch (error) {
      return rejectWithValue(apiService.getErrorMessage(error))
    }
  }
)

export const resendVerificationCode = createAsyncThunk(
  'auth/resendVerificationCode',
  async (data: ResendVerificationCodeRequest, { rejectWithValue }) => {
    try {
      const response = await authService.resendVerificationCode(data)
      if (response.success) {
        return true
      }
      return rejectWithValue('Failed to resend verification code')
    } catch (error) {
      return rejectWithValue(apiService.getErrorMessage(error))
    }
  }
)

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await authService.forgotPassword({ email })
      if (response.success) {
        return response.data
      }
      return rejectWithValue('Failed to send reset code')
    } catch (error) {
      return rejectWithValue(apiService.getErrorMessage(error))
    }
  }
)

export const sendResetCode = createAsyncThunk(
  'auth/sendResetCode',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await authService.sendResetCode({ email })
      if (response.success) {
        return response.data
      }
      return rejectWithValue('Failed to resend reset code')
    } catch (error) {
      return rejectWithValue(apiService.getErrorMessage(error))
    }
  }
)

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (data: ResetPasswordRequest, { rejectWithValue }) => {
    try {
      const response = await authService.resetPassword(data)
      if (response.success) {
        return true
      }
      return rejectWithValue('Failed to reset password')
    } catch (error) {
      return rejectWithValue(apiService.getErrorMessage(error))
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.error = null
      localStorage.removeItem('user')
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
      state.error = null
    },
    clearError: (state) => {
      state.error = null
    },
    initializeAuth: (state) => {
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        try {
          state.user = JSON.parse(savedUser)
          state.isAuthenticated = true
        } catch {
          localStorage.removeItem('user')
        }
      }
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoading = false
        state.error = null
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Verify Email
    builder
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.isLoading = false
        state.error = null
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Resend Verification Code
    builder
      .addCase(resendVerificationCode.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(resendVerificationCode.fulfilled, (state) => {
        state.isLoading = false
        state.error = null
      })
      .addCase(resendVerificationCode.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Forgot Password
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false
        state.error = null
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Send Reset Code (Resend)
    builder
      .addCase(sendResetCode.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(sendResetCode.fulfilled, (state) => {
        state.isLoading = false
        state.error = null
      })
      .addCase(sendResetCode.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Reset Password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false
        state.error = null
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { logout, setUser, clearError, initializeAuth } = authSlice.actions
export default authSlice.reducer

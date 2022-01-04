import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { instance } from 'api';
import { loginUserType, newEmailType, newPasswordType, registerUserType, resetPasswordType } from 'core/types/api/auth.types';
import SnackbarUtils from 'core/utils/SnackbarUtils';
import { rootReducerInterface } from '../rootReducer';

export interface authReducerInterface {
  registerFetchStatus: null | string;
  loginFetchStatus: null | string;
  accessToken: null | string;
  user: null | { email: string; userId: number; userName: string };
  userFetchStatus: null | string;
  postNewEmailFetchStatus: null | string;
  postResetPasswordFetchStatus: null | string;
  postNewPasswordFetchStatus: null | string;
  getConfirmEmailFetchStatus: null | string;
}

const INIT_STATE: authReducerInterface = {
  registerFetchStatus: null,
  loginFetchStatus: null,
  accessToken: null,
  user: null,
  userFetchStatus: null,
  postNewEmailFetchStatus: null,
  postNewPasswordFetchStatus: null,
  postResetPasswordFetchStatus: null,
  getConfirmEmailFetchStatus: null,
};

export const postRegister = createAsyncThunk<any, registerUserType, { rejectValue: string }>(
  'auth/registeruser',
  async (data, { rejectWithValue }) => {
    return await instance
      .post('/Auth/RegisterUser', data)
      .then((response: any) => {
        console.log(response);
        if (response.data?.errors && response.data.errors.length > 0) {
          return rejectWithValue(response.data.errors[0]);
        }
        return response.data;
      })
      .catch((error) => rejectWithValue(error.response.data.title));
  }
);

export const getCurrentUser = createAsyncThunk<any, void, { state: rootReducerInterface; rejectValue: string }>(
  'auth/getCurrentUser',
  async (_, { rejectWithValue, getState }) => {
    const {
      auth: { accessToken },
    } = getState();

    return await instance
      .post('/Auth/GetCurrentUserByToken', { token: accessToken })
      .then((response) => {
        return response.data;
      })
      .catch((error) => rejectWithValue(error.response.data.title));
  }
);

export const postLogin = createAsyncThunk<any, loginUserType, { rejectValue: string }>('auth/login', async (data, { rejectWithValue }) => {
  return await instance
    .post<{ token: string; user: { email: string; id: number; userName: string }; errors: string[] }>('/Auth/LoginUser', data)
    .then((response) => {
      if (response.data?.errors && response.data.errors.length > 0) {
        return rejectWithValue(response.data.errors[0]);
      }
      return response.data;
    })
    .catch((error) => rejectWithValue(error.response.data.title));
});

export const postLogout = createAsyncThunk<any, void, { state: rootReducerInterface; rejectValue: string }>(
  'auth/logout',
  async (_, { rejectWithValue, getState }) => {
    const {
      auth: { accessToken, user },
    } = getState();

    let email;
    if (user) {
      email = user.email;
    }

    return await instance
      .post('/Auth/LogoutUser', { email }, { headers: { authorization: `Bearer ${accessToken}` } })
      .then((response) => {
        return response.data;
      })
      .catch((error) => rejectWithValue(error.response.data.title));
  }
);

export const getConfirmEmail = createAsyncThunk<any, string, { rejectValue: string }>(
  'auth/confirmEmail',
  async (queryString, { rejectWithValue }) => {
    return await instance
      .get(`/Auth/ConfirmEmail${queryString}`)
      .then((response) => {
        if (response.data) {
          return response.data;
        } else {
          return rejectWithValue('Wystąpił problem z potwierdzeniem');
        }
      })
      .catch((error) => rejectWithValue(error.response.data.title));
  }
);

export const postResetPassword = createAsyncThunk<any, resetPasswordType, { state: rootReducerInterface; rejectValue: string }>(
  'auth/resetPassword',
  async (data, { rejectWithValue, getState }) => {
    return await instance
      .post('/Auth/ResetPassword', data)
      .then((response: any) => {
        if (response.data?.errors && response.data.errors.length > 0) {
          return rejectWithValue(response.data.errors[0]);
        }
        return response.data;
      })
      .catch((error) => rejectWithValue(error.response.data.title));
  }
);

export const postNewPassword = createAsyncThunk<any, newPasswordType, { state: rootReducerInterface; rejectValue: string }>(
  'auth/newPassword',
  async (data, { rejectWithValue, getState }) => {
    const {
      auth: { accessToken },
    } = getState();

    return await instance
      .post('/Auth/ChangePassword', data, { headers: { authorization: `Bearer ${accessToken}` } })
      .then((response: any) => {
        if (response.data?.errors && response.data.errors.length > 0) {
          return rejectWithValue(response.data.errors[0]);
        }
        return response.data;
      })
      .catch((error) => rejectWithValue(error.response.data.title));
  }
);

export const postNewEmail = createAsyncThunk<any, newEmailType, { state: rootReducerInterface; rejectValue: string }>(
  'auth/newEmail',
  async (data, { rejectWithValue, getState }) => {
    const {
      auth: { accessToken },
    } = getState();

    return await instance
      .post('/Auth/ChangeEmail', { ...data, token: accessToken }, { headers: { authorization: `Bearer ${accessToken}` } })
      .then((response: any) => {
        if (response.data?.errors && response.data.errors.length > 0) {
          return rejectWithValue(response.data.errors[0]);
        }
        return response.data;
      })
      .catch((error) => rejectWithValue(error.response.data.title));
  }
);

export const authReducer = createSlice({
  name: 'auth',
  initialState: INIT_STATE,
  reducers: {
    logout(state) {
      state.accessToken = null;
      state.user = null;
    },
    clearRegisterFetchStatus(state) {
      state.registerFetchStatus = null;
    },
    clearLoginFetchStatus(state) {
      state.loginFetchStatus = null;
    },
    clearPostResetPasswordFetchStatus(state) {
      state.postResetPasswordFetchStatus = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postRegister.pending, (state, action) => {
        state.registerFetchStatus = action.meta.requestStatus;
      })
      .addCase(postRegister.fulfilled, (state, action) => {
        state.registerFetchStatus = action.meta.requestStatus;
        SnackbarUtils.success('Zarejestrowano pomyślnie');
      })
      .addCase(postRegister.rejected, (state, action) => {
        state.registerFetchStatus = action.meta.requestStatus;
        SnackbarUtils.error(action.payload || 'Nie udało się zarejestrować');
      })
      .addCase(getConfirmEmail.pending, (state, action) => {
        state.getConfirmEmailFetchStatus = action.meta.requestStatus;
      })
      .addCase(getConfirmEmail.fulfilled, (state, action) => {
        state.getConfirmEmailFetchStatus = action.meta.requestStatus;
      })
      .addCase(getConfirmEmail.rejected, (state, action) => {
        state.getConfirmEmailFetchStatus = action.meta.requestStatus;
      })
      .addCase(postLogin.pending, (state, action) => {
        state.loginFetchStatus = action.meta.requestStatus;
      })
      .addCase(postLogin.fulfilled, (state, action) => {
        state.loginFetchStatus = action.meta.requestStatus;
        state.accessToken = action.payload.token;
        state.user = {
          userName: action.payload.user.userName,
          email: action.payload.user.email,
          userId: action.payload.user.id,
        };
        SnackbarUtils.success('Zalogowano pomyślnie');
      })
      .addCase(postLogin.rejected, (state, action) => {
        state.loginFetchStatus = action.meta.requestStatus;
        SnackbarUtils.error(action.payload || 'Nie udało się zalogować');
      })
      .addCase(getCurrentUser.pending, (state, action) => {
        state.userFetchStatus = action.meta.requestStatus;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.userFetchStatus = action.meta.requestStatus;
        state.user = {
          userName: action.payload.user.userName,
          email: action.payload.user.email,
          userId: action.payload.user.id,
        };
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.userFetchStatus = action.meta.requestStatus;
        SnackbarUtils.error('Pobieranie danych nie powiodło się');
      })
      .addCase(postNewEmail.pending, (state, action) => {
        state.postNewEmailFetchStatus = action.meta.requestStatus;
      })
      .addCase(postNewEmail.fulfilled, (state, action) => {
        state.postNewEmailFetchStatus = action.meta.requestStatus;
        SnackbarUtils.success('Zmieniono email');
      })
      .addCase(postNewEmail.rejected, (state, action) => {
        state.postNewEmailFetchStatus = action.meta.requestStatus;
        SnackbarUtils.error(action.payload || 'Zmiana maila nie powiodła się');
      })
      .addCase(postResetPassword.pending, (state, action) => {
        state.postResetPasswordFetchStatus = action.meta.requestStatus;
      })
      .addCase(postResetPassword.fulfilled, (state, action) => {
        state.postResetPasswordFetchStatus = action.meta.requestStatus;
        SnackbarUtils.success('Zmieniono hasło');
      })
      .addCase(postResetPassword.rejected, (state, action) => {
        state.postResetPasswordFetchStatus = action.meta.requestStatus;
        SnackbarUtils.error(action.payload || 'Zmiana hasła nie powiodła się');
      })
      .addCase(postNewPassword.pending, (state, action) => {
        state.postNewPasswordFetchStatus = action.meta.requestStatus;
      })
      .addCase(postNewPassword.fulfilled, (state, action) => {
        state.postNewPasswordFetchStatus = action.meta.requestStatus;
        SnackbarUtils.success('Zmieniono hasło');
      })
      .addCase(postNewPassword.rejected, (state, action) => {
        state.postNewPasswordFetchStatus = action.meta.requestStatus;
        SnackbarUtils.error(action.payload || 'Zmiana hasła nie powiodła się');
      });
  },
});

export const { logout, clearLoginFetchStatus, clearRegisterFetchStatus, clearPostResetPasswordFetchStatus } = authReducer.actions;

export const selectAccessToken = (state: rootReducerInterface) => state.auth.accessToken;
export const selectUser = (state: rootReducerInterface) => state.auth.user;
export const selectLoginFetchStatus = (state: rootReducerInterface) => state.auth.loginFetchStatus;
export const selectRegisterFetchStatus = (state: rootReducerInterface) => state.auth.registerFetchStatus;
export const selectGetConfirmEmailFetchStatus = (state: rootReducerInterface) => state.auth.getConfirmEmailFetchStatus;
export const selectPostResetPasswordFetchStatus = (state: rootReducerInterface) => state.auth.postResetPasswordFetchStatus;

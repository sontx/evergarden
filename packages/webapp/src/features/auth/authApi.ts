import { AuthUser } from "@evergarden/shared";
import Logger from "js-logger";
import api from "../../utils/api";

export interface LoggedInData {
  user: AuthUser;
}

export async function logout() {
  try {
    return await api.post("/api/auth/logout");
  } catch (error) {
    Logger.error(error);
  }
}

async function authenticate(token: string): Promise<AuthUser> {
  const response = await api.get<AuthUser>("/api/auth", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export function loginWithGoogle(): Promise<AuthUser | null> {
  return new Promise<AuthUser | null>((resolve, reject) => {
    const width = 600;
    const height = 600;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;
    const popup = window.open(
      "/api/auth/google",
      "",
      `toolbar=no, location=no, directories=no, status=no, menubar=no,scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`,
    );

    let timer = -1;
    if (popup) {
      timer = window.setInterval(() => {
        if (popup.closed && timer >= 0) {
          window.clearInterval(timer);
          resolve(null);
        }
      }, 100);
    }

    const listener = async (message: MessageEvent<any>) => {
      if (message.source === popup) {
        if (timer >= 0) {
          window.clearInterval(timer);
        }
        popup?.close();

        const { token } = message.data || {};
        try {
          const authenticatedUser = await authenticate(token);
          resolve(authenticatedUser);
        } catch (e) {
          Logger.error(e);
          reject(e.message);
        }
        window.removeEventListener("message", listener);
      }
    };
    window.addEventListener("message", listener);
  });
}

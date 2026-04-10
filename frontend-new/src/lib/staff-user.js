import { api } from "@/lib/api-client";
import { getUser } from "@/config";

let _cachedMe = null;
let _fetching = null;

/**
 * Get the current staff user with system_user_id.
 * Caches the /me response so it's only called once per session.
 */
export async function getStaffUser() {
  const u = getUser();

  // Return cached if available
  if (_cachedMe) {
    return { ...u, ..._cachedMe };
  }

  // Avoid duplicate concurrent calls
  if (_fetching) {
    await _fetching;
    return { ...u, ..._cachedMe };
  }

  _fetching = (async () => {
    try {
      const { data } = await api.get("/me");
      const me = data?.user;
      _cachedMe = {
        system_user_id: me?.system_user_id,
        employee_name: me?.employee_name,
        employee_profile_picture: me?.employee_profile_picture,
        branch_id: me?.branch_id,
        branch: me?.branch,
        web_login_access: me?.web_login_access,
        mobile_app_login_access: me?.mobile_app_login_access,
        tracking_status: me?.tracking_status,
        mobile_punch: me?.mobile_punch,
        employee_record: me?.employee_record,
      };
    } catch (e) {
      _cachedMe = {};
    }
  })();

  await _fetching;
  _fetching = null;

  return { ...u, ..._cachedMe };
}

export function clearStaffCache() {
  _cachedMe = null;
  _fetching = null;
}

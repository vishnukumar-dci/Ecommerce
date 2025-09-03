// "use client";
// import { useAuth } from "@/lib/store/auth";
// import { Button } from "@/components/ui/button";
// import { clearAuthCookie } from "@/lib/cookies";
// import { useCart } from "@/lib/store/cart";
// import { Pencil } from "lucide-react";

// import Footer from "@/components/layout/Footer";

// export default function ProfilePage() {
//   const auth = useAuth();
//   const clearCart = useCart((s) => s.clear);

//   async function logoutAll() {
//     try {
//       await fetch("http://localhost:8088/customer/logout", { method: "GET", credentials: "include" });
//     } catch {}
//     // Clear client state
//     clearCart();
//     auth.logout();
//     clearAuthCookie();
//     location.assign("/");
//   }

//   async function onEdit() {
    
//   }

//   return (
//     <div className="min-h-full flex items-center">
//       <div className="w-full max-w-2xl mx-auto space-y-6">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
//             Profile Overview
//           </h1>
//         </div>

//         {/* Profile Card */}
//         <div className="rounded-2xl border p-6 bg-white shadow-sm relative flex items-center justify-between">
//           {/* Left side - User Info */}
//           <div>
//             <h2 className="text-xl font-bold text-gray-900">
//               {auth.name || "-"}
//             </h2>
//             <p className="text-gray-500">{auth.email || "-"}</p>
//           </div>

//           {/* Right side - Avatar */}
//           <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
//             <svg
//               className="w-10 h-10 text-gray-400"
//               fill="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 
//                 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 
//                 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"
//               />
//             </svg>
//           </div>

//           {/* Edit Button - floating top right inside card */}
//           <button
//             onClick={onEdit}
//             className="absolute top-3 right-3 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
//           >
//             <Pencil className="w-5 h-5 text-gray-600" />
//           </button>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex justify-between">
//           <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl">
//             Shop Now
//           </Button>
//           <Button
//             onClick={logoutAll}
//             className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl"
//           >
//             Logout
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { useAuth } from "@/lib/store/auth";
import { Button } from "@/components/ui/button";
import { clearAuthCookie } from "@/lib/cookies";
import { useCart } from "@/lib/store/cart";
import { Pencil } from "lucide-react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const auth = useAuth();
  const clearCart = useCart((s) => s.clear);

  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    image?: File;
  }>({
    name: auth.name || "",
    // image: auth.image || "",
  });

  async function logoutAll() {
    try {
      await fetch("http://localhost:8088/customer/logout", {
        method: "GET",
        credentials: "include",
      });
    } catch {}
    clearCart();
    auth.logout();
    clearAuthCookie();
    location.assign("/");
  }

  function handleEditClick() {
    setIsEditing(true);
  }

  async function handleSave() {
    try {
      if (!formData.name) {
        alert("Name is required");
        return;
      }

      const res = await api.updateProfile({
        name: formData.name,
        image: formData.image,
      });

      
      const newUser = res.user;
      const newToken = res.token || auth.token;

      // overwrite cookie
      document.cookie = `auth=${encodeURIComponent(
        JSON.stringify({ ...newUser, token: newToken })
      )}; path=/;`;

      auth.setAuth({ ...newUser, token: newToken });
      setIsEditing(false);
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  }

  return (
    <div className="min-h-full flex items-center">
      <div className="w-full max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            Profile Overview
          </h1>
        </div>

        {/* Profile Card */}
        <div className="rounded-2xl border p-6 bg-white shadow-sm relative flex items-center justify-between">
          {/* User Info */}
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {auth.name || "-"}
            </h2>
            <p className="text-gray-500">{auth.email || "-"}</p>
          </div>

          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 
                2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 
                1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"
              />
            </svg>
          </div>

          {/* Edit Button */}
          <button
            onClick={handleEditClick}
            className="absolute top-3 right-3 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
          >
            <Pencil className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl" onClick={() => router.push('/products')}>
            Shop Now
          </Button>
          <Button
            onClick={logoutAll}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl"
          >
            Logout
          </Button>
        </div>

        {/* Edit Popup Modal */}
        {isEditing && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl p-6 shadow-lg w-full max-w-md">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Edit Profile
              </h2>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Enter name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />
                <input
                  type="file"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      image: e.target.files?.[0], // ✅ store File object
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <Button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

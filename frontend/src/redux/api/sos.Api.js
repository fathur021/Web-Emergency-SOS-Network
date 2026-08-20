import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://localhost:5000/api";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const sosApi = createApi({
  reducerPath: "sosApi",
  baseQuery,
  tagTypes: ["Sos", "User", "Volunteer"],
  endpoints: (builder) => ({
    // GET /api/user/profile — ambil profil user yang login
    getProfile: builder.query({
      query: () => "/user/profile",
      providesTags: ["User"],
    }),

    // PATCH /api/user/location — update lokasi & radius
    updateLocation: builder.mutation({
      query: (body) => ({
        url: "/user/location",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    // POST /api/sos — kirim sinyal SOS (FormData: lat, lng, desc?, foto?)
    createSos: builder.mutation({
      query: (formData) => ({
        url: "/sos",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Sos"],
    }),

    // GET /api/sos — semua sinyal (dipakai admin & relawan)
    getAllSos: builder.query({
      query: () => "/sos",
      providesTags: ["Sos"],
      refetchOnMountOrArgChange: true,
    }),

    // GET /api/sos/user — riwayat milik user sendiri
    getSosByUser: builder.query({
      query: () => "/sos/user",
      providesTags: ["Sos"],
    }),

    // PATCH /api/sos/:id/status — relawan mengklaim/menyelesaikan SOS
    updateSosStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/sos/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Sos"],
    }),

    // GET /api/user/volunteers — semua relawan aktif beserta lokasi
    getVolunteers: builder.query({
      query: () => "/user/volunteers",
      providesTags: ["Volunteer"],
    }),
  }),
});

export const {
  useCreateSosMutation,
  useGetAllSosQuery,
  useGetSosByUserQuery,
  useUpdateSosStatusMutation,
  useGetProfileQuery,
  useUpdateLocationMutation,
  useGetVolunteersQuery,
} = sosApi;

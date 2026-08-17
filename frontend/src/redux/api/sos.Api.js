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
  tagTypes: ["Sos"],
  endpoints: (builder) => ({
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
  }),
});

export const {
  useCreateSosMutation,
  useGetAllSosQuery,
  useGetSosByUserQuery,
  useUpdateSosStatusMutation,
} = sosApi;

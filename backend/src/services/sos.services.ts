import { Sos } from "../model/sos.model.js";
import { AppError } from "../error/app.error.js";
import { Types } from "mongoose";
import type {
  ICreateSosInput,
  IUpdateSosDataInput,
  IUpdateSosStatusInput,
} from "../interface/sos.interface.js";

async function createSosServices(
  userId: string | Types.ObjectId,
  input: ICreateSosInput,
) {
  const sos = await Sos.create({
    userId,
    latitude: input.latitude,
    longitude: input.longitude,
    description: input.description,
    image: input.image || null,
  });
  return sos;
}

async function getAllSosServices() {
  const sos = await Sos.find()
    .populate("userId", "nama email")
    .populate("volunteerId", "nama")
    .sort({ createdAt: -1 });

  if (!sos || sos.length == 0) {
    throw new AppError(404, "Belum ada sinyal SOS");
  }
  return sos;
}

async function getSosByIdServices(id: string) {
  const sos = await Sos.findById(id)
    .populate("userId", "nama email")
    .populate("volunteerId", "nama");

  if (!sos) {
    throw new AppError(404, "Sinyal SOS tidak ditemukan");
  }

  return sos;
}

async function getSosByUserServices(userId: string | Types.ObjectId) {
  const sosList = await Sos.find({ userId })
    .populate("volunteerId", "nama")
    .sort({ createdAt: -1 });

  if (!sosList || sosList.length == 0) {
    throw new AppError(404, "Belum ada riwayat SOS");
  }
  return sosList;
}

async function updateSosStatusServices(
  id: string | Types.ObjectId,
  input: IUpdateSosStatusInput,
  volunteerId: string | Types.ObjectId | null,
) {
  const existing = await Sos.findById(id);
  if (!existing) {
    throw new AppError(404, "Sinyal SOS tidak ditemukan");
  }

  // Set volunteerId hanya saat status menuju "in_progress"/"resolved"
  const updateData: {
    status: IUpdateSosStatusInput["status"];
    volunteerId?: Types.ObjectId | null;
  } = { status: input.status };

  if (input.status === "in_progress" || input.status === "resolved") {
    if (!volunteerId) {
      throw new AppError(400, "volunteerId wajib diisi saat mengklaim sinyal");
    }
    updateData.volunteerId = volunteerId as Types.ObjectId;
  } else {
    updateData.volunteerId = null; // kembali pending/rejected = lepas tanggung jawab
  }
  const sos = await Sos.findByIdAndUpdate(id, updateData, { new: true });
  return sos;
}

async function updateSosDataServices(id: string, input: IUpdateSosDataInput) {
  const existing = await Sos.findById(id);
  if (!existing) {
    throw new AppError(404, "Sinyal SOS tidak ditemukan");
  }

  const sos = await Sos.findByIdAndUpdate(id,input, {new:true});
  return sos
}

async function deleteSosServices(id:string){
    const existing = await Sos.findById(id);
    if (!existing) {
    throw new AppError(404, "Sinyal SOS tidak ditemukan");
  }

  await Sos.findByIdAndDelete(id);
  return {message: "Sinyal Sos Berhasil di hapus"}
}
export { createSosServices,
    getAllSosServices,
    getSosByIdServices,
    getSosByUserServices,
    updateSosStatusServices,
    updateSosDataServices,
    deleteSosServices
 };

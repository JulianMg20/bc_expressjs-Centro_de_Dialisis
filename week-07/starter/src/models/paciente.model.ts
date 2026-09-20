import { Schema, model, type Document, type Types } from "mongoose";

export interface IPaciente extends Document {
  nombre: string;
  turno: "mañana" | "tarde" | "noche";
  tipoTratamiento: string;
  costoSesion: number;
  diasPorSemana: number;
  activo: boolean;
  registradoPor: Types.ObjectId;
}

const pacienteSchema = new Schema<IPaciente>(
  {
    nombre: { type: String, required: true, trim: true },
    turno: { type: String, enum: ["mañana", "tarde", "noche"], required: true },
    tipoTratamiento: { type: String, enum: ["hemodialisis", "dialisis_peritoneal", "hemodiafiltracion"], required: true },
    costoSesion: { type: Number, required: true, min: 0 },
    diasPorSemana: { type: Number, required: true, min: 1, max: 7 },
    activo: { type: Boolean, default: true },
    registradoPor: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Paciente = model<IPaciente>("Paciente", pacienteSchema);
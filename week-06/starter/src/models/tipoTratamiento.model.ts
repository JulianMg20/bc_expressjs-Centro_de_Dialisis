import { Schema, model, type Document } from "mongoose";

export interface ITipoTratamiento extends Document {
  nombre: string;
  descripcion?: string;
}

const tipoTratamientoSchema = new Schema<ITipoTratamiento>(
  {
    nombre: { type: String, required: true, unique: true, trim: true },
    descripcion: { type: String },
  },
  { timestamps: true }
);

export const TipoTratamiento = model<ITipoTratamiento>("TipoTratamiento", tipoTratamientoSchema);
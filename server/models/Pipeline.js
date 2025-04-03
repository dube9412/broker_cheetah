const mongoose = require("mongoose");

const PipelineSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    address: { type: String, required: true },
    fico: { type: Number, required: true },
    experience: { type: Number, required: true },
    purchasePrice: { type: Number, required: true },
    asisValue: { type: Number, required: true },
    rehabNeeded: { type: Number, required: true },
    arv: { type: Number, required: true },
    liquidity: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Pipeline = mongoose.model("Pipeline", PipelineSchema);

module.exports = Pipeline;

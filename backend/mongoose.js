const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/ANALYTICS", {});

// Schema for leaves count per department
const DepartmentLeavesSchema = new mongoose.Schema({
  agri: Number,
  aids: Number,
  bme: Number,
  chem: Number,
  civil: Number,
  cse: Number,
  'cse-iot': Number,
  'cse-cs': Number,
  ece: Number,
  eee: Number,
  it: Number,
  mech: Number,
  mca: Number,
  mba: Number
}, { _id: false });

// Schema for the year and the departments' leaves
const YearSchema = new mongoose.Schema({
  1: { type: DepartmentLeavesSchema, required: true },
  2: { type: DepartmentLeavesSchema, required: true },
  3: { type: DepartmentLeavesSchema, required: true },
  4: { type: DepartmentLeavesSchema, required: true }
}, { _id: false });

// Schema for the date which contains the year schema
const DateSchema = new mongoose.Schema({
  date: { type: String, required: true },
  years: { type: YearSchema, required: true }
}, { _id: false });

// Main schema for the report document
const ReportSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  dates: { type: Map, of: [DateSchema], required: true }
});

const Report = mongoose.model("Report", ReportSchema);

module.exports = { Report };

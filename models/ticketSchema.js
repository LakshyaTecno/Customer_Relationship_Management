const constants = require("../utils/constants");

const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    ticketPriority: {
      type: Number,
      required: true,
      default: 4,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: constants.ticketStatsues.open,
      enum: [
        constants.ticketStatsues.blocked,
        constants.ticketStatsues.closed,
        constants.ticketStatsues.open,
      ],
    },
    reporter: {
      type: String,
      required: true,
    },
    assignee: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      immutable: true,
      default: () => {
        return Date.now();
      },
    },
    updatedAt: {
      type: Date,
      default: () => {
        return Date.now();
      },
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Ticket", ticketSchema);

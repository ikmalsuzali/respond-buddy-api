// @ts-nocheck
import { triggerWorkflow } from "../workflow/service";
const EventEmitter = require("events");

class EventManager {
  constructor() {
    this.emitter = new EventEmitter();
  }

  on(eventName: string, callback) {
    this.emitter.on(eventName, callback);
  }

  emit(eventName, data) {
    console.log(
      "🚀 ~ file: eventManager.ts:33 ~ EventManager ~ emit ~ data:",
      data
    );
    if (eventName === "workflow" && !data.workspace_integration_id) {
      throw new Error("workspace_integration_id is required");
    }

    this.emitter.emit(eventName, data);
  }
}

export default EventManager;

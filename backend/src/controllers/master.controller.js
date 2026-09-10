export function makeMaster(Model) {
  return {
    list: async (_, res) => res.json(await Model.find().sort({ name: 1 })),
    create: async (req, res) => res.status(201).json(await Model.create(req.body)),
    update: async (req, res) => {
      const item = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!item) return res.status(404).json({ message: "Record not found" });
      res.json(item);
    },
    remove: async (req, res) => {
      const item = await Model.findByIdAndDelete(req.params.id);
      if (!item) return res.status(404).json({ message: "Record not found" });
      res.json({ message: "Deleted" });
    }
  };
}

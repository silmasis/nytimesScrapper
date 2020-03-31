module.exports = (model, Schema) => {

  const Article = new Schema({
    title: { type: String, required: true },
    summary: { type: String, required: true },
    url: { type: String, required: true },
    category: String,
    unique_name: { type: String, unique: true, required: true},
    isSaved: { type: Boolean, required: true, default: false},
    notes: [{ type: Schema.Types.ObjectId , ref: 'Note' }]
  }, {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  })

  return model('Article', Article)
}
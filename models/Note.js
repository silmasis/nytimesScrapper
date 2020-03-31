module.exports = (model, Schema) => {

  const Note = new Schema({
    body: String,
    article: { type: Schema.Types.ObjectId, ref: 'Article' }
  }, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  })

  return model('Note', Note)
}
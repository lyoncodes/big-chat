export const findById = (resources, id) => {
  return resources.find(r => r.id === id)
}

export const upsert = (resources, resource) => {
  const idx = resources.findIndex(r => r.id === resource.id)
  if (resource.id && idx !== -1) {
    resources[idx] = resource
  } else {
    resources.push(resource)
  }
}

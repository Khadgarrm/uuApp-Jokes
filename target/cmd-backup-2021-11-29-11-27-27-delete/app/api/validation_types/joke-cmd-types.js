const jokeCmdDtoInType = shape({
  name: uu5String(255).isRequired(),
  text: uu5String(4000),
  categoryIdList: array(id(), 10),
  image: binary(),
});

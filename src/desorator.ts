export function AutoBind(
  _: any,
  __: string,
  propertyDescriptor: PropertyDescriptor
) {
  const origin = propertyDescriptor.value;

  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      return origin.bind(this);
    },
  };
  return adjDescriptor;
}

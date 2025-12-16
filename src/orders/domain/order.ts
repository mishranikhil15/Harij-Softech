export enum OrderStatus {
  CREATED = 'CREATED',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  SERVED = 'SERVED',
  PAID = 'PAID',
}

export class Order {
  constructor(
    public readonly id: string,
    public readonly tableId: number,
    public readonly waiterId: number,
    private status: OrderStatus = OrderStatus.CREATED,
  ) {}

  getStatus() {
    return this.status;
  }

  changeStatus(status: OrderStatus) {
    this.status = status;
  }
}

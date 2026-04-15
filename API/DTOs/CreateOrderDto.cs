using API.Entities.OrderAggregate;

namespace API.DTOs;

public record CreateOrderDto
{
    public required ShippingAddress ShippingAddress { get; set; }
    public required PaymentSummary PaymentSummary { get; set; }
}

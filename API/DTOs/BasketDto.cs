using System;

namespace API.DTOs;

public record BasketDto
{
    public required string BasketId { get; set; } 
    public List<BasketItemDto> Items { get; set; } = [];
    public string?  ClientSecret { get; set; }
    public string? PaymentIntentId { get; set; }
}

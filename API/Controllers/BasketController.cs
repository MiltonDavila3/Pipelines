using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class BasketController(StoreContext context) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<BasketDto>> GetBasket()
        {
            var basket = await RetrieveBasket();

            if (basket == null) return NoContent();

            return basket.ToDto();
        }

        [HttpPost]
        public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity)
        {

            var basket = await RetrieveBasket();

            basket ??= CreateBasket();

            var product = await context.Products
                .FindAsync(productId); //Find async if we have the primary key value

            if(product == null) return BadRequest("Problem adding item to basket");

            basket.AddItem(product, quantity);

            var result = await context.SaveChangesAsync() > 0;

            if(result) return CreatedAtAction(nameof(GetBasket), basket.ToDto());

            return BadRequest("Problem updating basket");
        }

        [HttpDelete]
        public async Task<ActionResult> RemoveBasketItem(int productId, int quantity)
        {
            // get basket
            var basket = await RetrieveBasket();

            if(basket == null) return NotFound("The basket was not found");

            //remove the item or reduce its quantity
            var product = await context.Products
                .FindAsync(productId);

            if(product == null) return NotFound("The product was not found");

            basket.RemoveItem(productId, quantity);

            var result = await context.SaveChangesAsync() > 0;

            if(result) return Ok();
            
            return BadRequest("Problem updating basket");

        }

        private async Task<Basket?> RetrieveBasket()
        {
            var basket = await context.Baskets.GetBasketWithItems(Request.Cookies["basketId"]);   //Get the id from the browser cookies
            return basket;
        }

        private Basket CreateBasket()
        {
            var basketId = Guid.NewGuid().ToString();
            var cookieOptions = new CookieOptions
            {
                IsEssential = true,
                Expires = DateTime.UtcNow.AddDays(30)
            };

            Response.Cookies.Append("basketId", basketId, cookieOptions);

            var basket = new Basket{BasketId = basketId};

            context.Baskets.Add(basket);
            return basket;

        }
    }
}

using API.Data;
using API.Entities;
using API.Middleware;
using API.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddCors();
builder.Services.AddTransient<ExceptionMiddleware>();
builder.Services.AddScoped<PaymentsService>();
builder.Services.AddDbContext<StoreContext>(opt =>
{
   opt.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")); 
});

builder.Services.AddIdentityApiEndpoints<User>(options =>
{
   options.User.RequireUniqueEmail = true;
})
   .AddRoles<IdentityRole>()
   .AddEntityFrameworkStores<StoreContext>();


var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();
app.UseCors(opt =>
{
   opt.AllowAnyHeader()
   .AllowAnyMethod()
   .AllowCredentials()
   .WithOrigins("https://localhost:3000");
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapGroup("api").MapIdentityApi<User>();


await DbInitializer.Initdb(app);

app.Run();

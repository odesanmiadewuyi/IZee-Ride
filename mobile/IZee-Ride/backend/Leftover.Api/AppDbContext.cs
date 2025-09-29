using Microsoft.EntityFrameworkCore;
using Leftover.Api.Models;

namespace Leftover.Api;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Cause> Causes => Set<Cause>();
    public DbSet<Wallet> Wallets => Set<Wallet>();
    public DbSet<Transaction> Transactions => Set<Transaction>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().HasIndex(u => u.Phone).IsUnique(false);
        modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique(false);
        modelBuilder.Entity<Wallet>().HasOne(w => w.User).WithOne(u => u.Wallet!).HasForeignKey<Wallet>(w => w.UserId);
        base.OnModelCreating(modelBuilder);
    }
}

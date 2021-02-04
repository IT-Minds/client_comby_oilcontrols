using System.Collections.Generic;
using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;

namespace Application.Roles
{
  public class RoleDto
  {
    public string Name { get; set; }
    public ICollection<Action> Actions { get; set; }
  }
}

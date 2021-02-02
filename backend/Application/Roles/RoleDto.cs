using System.Collections.Generic;
using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;

namespace Application.Roles
{
  //TODO: Figure out a way to use Automapper to map the action enum from RoleAction list to thie Actions list.
  public class RoleDto
  {
    public string Name { get; set; }
    public ICollection<Action> Actions { get; set; }
  }
}

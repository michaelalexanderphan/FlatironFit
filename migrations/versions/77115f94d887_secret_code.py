"""secret code

Revision ID: 77115f94d887
Revises: 2ee3fe0cd0b8
Create Date: 2023-12-18 02:53:17.194569

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '77115f94d887'
down_revision = '2ee3fe0cd0b8'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('secret_code', sa.String(length=255), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_column('secret_code')

    # ### end Alembic commands ###